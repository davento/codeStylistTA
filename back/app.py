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
    """
    Expects JSON payload with:
      - fileName: name of the file (or "Code Input")
      - feedback: an object containing:
           error_location, things_to_fix, suggestions, explanation
      - rating: a number
    Updates or appends the row in ratings.csv accordingly.
    """
    try:
        data = request.get_json()
        print(data)
        file_name = data.get('fileName')
        feedback_data = data.get('feedback')
        rating = data.get('rating')
        if feedback_data is None or rating is None or file_name is None:
            return jsonify({'error': 'Invalid payload, missing fileName, feedback or rating'}), 400

        update_rating_csv(file_name, feedback_data, rating)
        return jsonify({'success': True}), 200
    except Exception as e:
        print("Error in submit_rating:", e)
        return jsonify({'error': 'Server error'}), 500


if __name__ == '__main__':
    app.run(port=5001)