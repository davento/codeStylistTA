from flask import Flask, request
from flask_cors import CORS
import src.AIAgent.appAssistant as appAssistant

app = Flask(__name__)
CORS(app)

@app.route("/input", methods=["POST"])
def process_input():
    request_data = request.get_json()

    # course = None
    # course_name = None
    # course_description = None
    # course_learning_objectives = None
    # code = None
    # programming_language = None
    # programming_language_name = None
    # reply_tone = None
    # reply_format = None

    # if request_data:
    #     if 'course' in request_data:
    #         course = request_data['course']
    #         if 'name' in course:
    #             course_name = course['name']
    #         if 'description' in course:
    #             course_description = course['description']
    #         # make this a list string thing
    #         if 'learningObjectives' in course:
    #             course_learning_objectives = course['learningObjectives']
    #     if 'code' in request_data:
    #         code = request_data['code']
    #     if 'programmingLanguage' in request_data:
    #         programming_language = request_data['programmingLanguage']
    #         if 'name' in programming_language:
    #             programming_language_name = programming_language['name']
    #     if 'tone' in request_data:
    #         reply_tone = request_data['tone']
    #     if 'format' in request_data:
    #         reply_format = request_data['format']
        
    course = request_data['course']
    course_name = course['name']
    course_description = course['description']
    course_learning_objectives = course['learningObjectives']
    code = request_data['code']
    programming_language = request_data['programmingLanguage']
    programming_language_name = programming_language['name']
    reply_tone = request_data['tone']
    reply_format = request_data['format']

    query = '''
    The values of the variables declared on the initial prompt are the following:
        a. Name of the course: {}
        b. Description of the course: {}
        c. Learning objectives of the course: {}
        d. Code: {}
        e. Programming language used:{}
        f. Tone to use on reply: {}
        g. Format to use on reply: {}

        With these values, please fulfill the initially stated prompt.
    '''.format(
        course_name,
        course_description,
        course_learning_objectives,
        code,
        programming_language_name,
        reply_tone,
        reply_format
    )

    print(query)
    response = appAssistant.get_response(query)
    print(response)

    if response is not None:
        return "ok", 200
    return "error", 500