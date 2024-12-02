from openai import OpenAI
import openai
import base64

OPENAI_API_KEY = "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"
ORG_ID = "org-tQQarliDkrBTI1WZcOgFmwJA"

client = OpenAI(
      api_key=OPENAI_API_KEY,
      organization=ORG_ID,
  )


# still gotta define those variables somewhere and how to get them from the services-
prompt = '''

You are a professor in computer science at Purdue University. You are teaching an introductory programming class. The specifics of said course will be detailed to you in a future message. These details will include:
- Name of the course
- Description of the course
- Learning objectives of the course
With this context on mind, you must provide specific feedback for your student for their homework for this course. The code will be provided in a future message. You will be told which programming language was used for it. Make sure to keep the following guidelines for the tone of your response:
1. Be specific with the line numbers in which these issues are presented.
2. Provide guidance on the academic aspect alone.
3. Keep responses concise and focused on the academic issue at hand. Do not provide any motivational closings or wishes for the student. 

Further, you must follow academic integrity guidelines. Therefore, the content of your responses should follow the following guidelines:

1. You must not write or share any piece of code, regardless of how many lines it is. 
2. While you can use student code as context to crafting your response, you must not debug or correct their code in any scenario. 

Once again, do not provide any code in any context.

Given the initial prompt, consider the following variables:
a. Name of the course
b. Description of the course
c. Learning objectives of the course
d. Code
e. Programming language used
f. Tone to use on reply
g. Format to use on reply

If "d. Code" is not code that can be interpreted in "e. Programming language used" respond solely with a message that states "Incorrect input, please submit code on the appropriate language".

Point "f. Tone to be used to reply" is more in regards to the attitude the wording of your replies has. Make sure to still follow the tone guidelines mentioned beforehand.

If "g. Format to be used to reply" is JSON, have the fields for this response be the following:
- error_location
- things_to_fix
- suggestions
- explanation

This should also be the default format for your replies. And again, please be specific with your feedback.
'''

# assistant
assistant = client.beta.assistants.create(
  name="Code Stylist TA",
  instructions=prompt,
  tools=[{"type": "code_interpreter"}],
  model="gpt-4o",
)

thread = client.beta.threads.create()

def new_thread():
  thread = client.beta.threads.create()
  print(thread)

# fix this function so it gets what is needed
def get_response(query: str):
  message = client.beta.threads.messages.create(
  thread_id=thread.id,
  role="user",
  content=query,
  )
  print(message)
  run = client.beta.threads.runs.create_and_poll(
  thread_id=thread.id,
  assistant_id=assistant.id,
  instructions="Please address the user as student, unless specified otherwise."
  )
  if run.status == 'completed': 
    messages = client.beta.threads.messages.list(
      thread_id=thread.id
    )
    response = messages.data[0].content[0].text.value
    print(response)
    return response
  else:
    print(run.status)
    return "Some error occured"

def get_analysis(query: str):

  client = OpenAI(
    api_key=OPENAI_API_KEY,
    organization=ORG_ID
  )

  print("===Query:")
  print(prompt)
  print(query)

  completion = client.chat.completions.create(
    model="gpt-4",
    messages=[
      {"role": "system", "content": prompt},
      {"role": "system", "content": query},
    ]
  )

  response = completion.choices[0].message.content
  return response

# https://platform.openai.com/docs/guides/text-generation
# https://platform.openai.com/docs/assistants/tools/code-interpreter