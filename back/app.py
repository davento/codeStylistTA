from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os
import src.AIAgent.appAssistant as appAssistant
import src.util as util

app = Flask(__name__)
CORS(app)

RATINGS_CSV = 'ratings.csv'


def update_rating_csv(feedback_data, rating):
    """
    Update the CSV file with the given feedback_data and rating.
    If a row with the same feedback fields exists, update its rating.
    Otherwise, append a new row.
    feedback_data should be a dict with keys:
      - error_location
      - things_to_fix
      - suggestions
      - explanation
    """
    file_exists = os.path.isfile(RATINGS_CSV)
    updated = False
    rows = []

    if file_exists:
        with open(RATINGS_CSV, 'r', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if (row['error_location'] == feedback_data['error_location'] and
                        row['things_to_fix'] == feedback_data['things_to_fix'] and
                        row['suggestions'] == feedback_data['suggestions'] and
                        row['explanation'] == feedback_data['explanation']):
                    row['rating'] = str(rating)
                    updated = True
                rows.append(row)

    if not updated:
        new_row = {
            'error_location': feedback_data['error_location'],
            'things_to_fix': feedback_data['things_to_fix'],
            'suggestions': feedback_data['suggestions'],
            'explanation': feedback_data['explanation'],
            'rating': str(rating)
        }
        rows.append(new_row)

    with open(RATINGS_CSV, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['error_location', 'things_to_fix', 'suggestions', 'explanation', 'rating']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)
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
      - feedback: an object containing:
           error_location, things_to_fix, suggestions, explanation
      - rating: a number
    Updates or appends the row in ratings.csv accordingly.
    """
    try:
        data = request.get_json()
        feedback_data = data.get('feedback')
        rating = data.get('rating')
        if feedback_data is None or rating is None:
            return jsonify({'error': 'Invalid payload, missing feedback or rating'}), 400

        update_rating_csv(feedback_data, rating)
        return jsonify({'success': True}), 200
    except Exception as e:
        print("Error in submit_rating:", e)
        return jsonify({'error': 'Server error'}), 500


if __name__ == '__main__':
    app.run()