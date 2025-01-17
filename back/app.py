from flask import Flask, request
from flask_cors import CORS
import src.AIAgent.appAssistant as appAssistant
import src.util as util

app = Flask(__name__)
CORS(app)

# Main function for sending data from the front to the back for processing
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
    code = util.convert_code_str_to_array(request_data['code'])

    # Setting values
    configValues = '''
    The values of the variables declared on the initial prompt are the following:
    a. Name of the course: {}
    b. Description of the course: {}
    c. Learning objectives of the course: {}
    d. Programming language used:{}
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
        return response, 200
    return "error", 500

if __name__ == '__main__':
    app.run()