from flask import Flask, request
from flask_cors import CORS
import src.AIAgent.appAssistant as appAssistant

app = Flask(__name__)
CORS(app)

@app.route("/input", methods=["POST"])
def process_input():
    request_data = request.get_json()
        
    course = request_data['course']
    course_name = course['name']
    course_description = course['description']
    course_learning_outcomes = course['learning_outcomes']
    programming_language = request_data['programming_language']
    programming_language_name = programming_language['name']
    reply_tone = request_data['reply_tone']
    reply_format = request_data['reply_format']
    code = request_data['code']

    print("---Code:")
    i = 0
    while (i < len(code)):
      print(str(i) + code[i])
      i += 1
    print ("-------")

    query = '''
    The values of the variables declared on the initial prompt are the following:
        a. Name of the course: {}
        b. Description of the course: {}
        c. Learning objectives of the course: {}
        d. Programming language used:{}
        e. Tone to use on reply: {}
        f. Format to use on reply: {}
        g. Code: {}

        With these values, please fulfill the initially stated prompt.
    '''.format(
        course_name,
        course_description,
        course_learning_outcomes,
        programming_language_name,
        reply_tone,
        reply_format,
        code,
    )

    response = appAssistant.get_analysis(query)
    print("===Response:")
    print(response)

    if response is not None:
        return response, 200
    return "error", 500

if __name__ == '__main__':
    app.run()