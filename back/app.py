from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os
import src.AIAgent.appAssistant as appAssistant
import src.util as util

app = Flask(__name__)
CORS(app)

RATINGS_CSV = 'ratings.csv'


def update_rating_csv(file_name, feedback_data, rating):
    """
    Update the CSV file with the given file_name, feedback_data, and rating.
    If a row with the same fileName and feedback fields exists, update its rating.
    Otherwise, append a new row.
    feedback_data should be a dict with keys:
      - error_location
      - things_to_fix
      - suggestions
      - explanation
    """
    new_fieldnames = ['fileName', 'error_location', 'things_to_fix', 'suggestions', 'explanation', 'rating']
    file_exists = os.path.isfile(RATINGS_CSV)
    updated = False
    rows = []

    if file_exists:
        with open(RATINGS_CSV, 'r', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            # Always ensure fileName is the first field
            fieldnames = new_fieldnames  # Use our predefined fieldnames to maintain order

            for row in reader:
                # Ensure fileName exists and has a value
                if not row.get('fileName'):
                    row['fileName'] = file_name  # Use current file_name if missing

                # Compare all fields including fileName
                if (row.get('fileName', '') == file_name and
                        row.get('error_location', '') == feedback_data.get('error_location', '') and
                        row.get('things_to_fix', '') == feedback_data.get('things_to_fix', '') and
                        row.get('suggestions', '') == feedback_data.get('suggestions', '') and
                        row.get('explanation', '') == feedback_data.get('explanation', '')):
                    row['rating'] = str(rating)
                    updated = True
                rows.append(row)

    if not updated:
        new_row = {
            'fileName': file_name or '',  # Ensure fileName is never None
            'error_location': feedback_data.get('error_location', ''),
            'things_to_fix': feedback_data.get('things_to_fix', ''),
            'suggestions': feedback_data.get('suggestions', ''),
            'explanation': feedback_data.get('explanation', ''),
            'rating': str(rating)
        }
        rows.append(new_row)

    with open(RATINGS_CSV, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=new_fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    return updated

@app.route("/input", methods=["POST"])
def process_input():
    # Obtaining data
    request_data = request.get_json()

    # Parsing data
    course = request_data['course']
    course_name = course['name']
    course_description = course['description']
    course_learning_outcomes = course['learning_outcomes']
    programming_language = request_data['programming_language']
    programming_language_name = programming_language['name']
    programming_language_guidelines = programming_language['guidelines_location']
    reply_tone = request_data['reply_tone']
    reply_tone_name = reply_tone['name']
    reply_format = request_data['reply_format']
    reply_format_name = reply_format['name']
    code = util.convert_code_str_to_array(request_data['code'], programming_language_name)

    # Setting values
    configValues = '''
    The values of the variables declared on the initial prompt are the following:
    a. Name of the course: {}
    b. Description of the course: {}
    c. Learning objectives of the course: {}
    d. Programming language used: {}
    e. Tone to use on reply: {}
    f. Format to use on reply: {}
    '''.format(
        course_name,
        course_description,
        course_learning_outcomes,
        programming_language_name,
        reply_tone_name,
        reply_format_name,
    )

    # Setting guidelines
    guidelines = [programming_language_guidelines, programming_language_name]

    # Send them to the analysis
    response = appAssistant.get_analysis(configValues, code, guidelines)
    print("===Response:")
    print(response)

    if response is not None:
        cleaned_response = util.clean_json_response(response)
        return cleaned_response, 200
    return "error", 500


@app.route("/submit_rating", methods=["POST"])
def submit_rating():
    try:
        data = request.get_json()

        # Extract and log the data
        file_name = data["fileName"]
        error_location = data["feedback"]["error_location"]
        things_to_fix = data["feedback"]["things_to_fix"]
        suggestions = data["feedback"]["suggestions"]
        explanation = data["feedback"]["explanation"]
        rating = data["rating"]

        # Create CSV if it doesn't exist
        if not os.path.exists('ratings.csv'):
            logger.info("Creating new ratings.csv file")
            with open('ratings.csv', 'w', newline='') as file:
                writer = csv.writer(file)
                writer.writerow(['file_name', 'error_location', 'things_to_fix',
                                 'suggestions', 'explanation', 'rating'])

        # Read existing entries
        existing_entries = []
        updated = False

        with open('ratings.csv', 'r', newline='') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['file_name'] == file_name and row['error_location'] == error_location:
                    logger.info(f"Found matching entry for {file_name} at line {error_location}")
                    # Update existing entry
                    row['things_to_fix'] = things_to_fix
                    row['suggestions'] = suggestions
                    row['explanation'] = explanation
                    row['rating'] = rating
                    updated = True
                existing_entries.append(row)

        # If no matching entry was found, create a new one
        if not updated:
            new_entry = {
                'file_name': file_name,
                'error_location': error_location,
                'things_to_fix': things_to_fix,
                'suggestions': suggestions,
                'explanation': explanation,
                'rating': rating
            }
            existing_entries.append(new_entry)

        # Write back to CSV
        with open('ratings.csv', 'w', newline='') as file:
            fieldnames = ['file_name', 'error_location', 'things_to_fix',
                          'suggestions', 'explanation', 'rating']
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(existing_entries)

        # Verify the write operation
        logger.debug("Verifying written data")
        with open('ratings.csv', 'r', newline='') as file:
            reader = csv.DictReader(file)
            written_entries = list(reader)

        success_message = "Rating updated" if updated else "Rating added"
        return jsonify({
            "success": True,
            "message": success_message
        }), 200

    except KeyError as e:
        error_msg = f"Missing required field: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return jsonify({
            "success": False,
            "message": error_msg
        }), 400
    except Exception as e:
        error_msg = f"An error occurred: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return jsonify({
            "success": False,
            "message": error_msg
        }), 500


if __name__ == '__main__':
    app.run(port=5001)