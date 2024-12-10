from openai import OpenAI
import openai
import base64
import sys
sys.path.append("../src")
import src.util as util

OPENAI_API_KEY = "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"
ORG_ID = "org-tQQarliDkrBTI1WZcOgFmwJA"

client = OpenAI(
      api_key=OPENAI_API_KEY,
      organization=ORG_ID,
  )


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
d. Programming language used
e. Tone to use on reply
f. Format to use on reply
g. Code

An upcoming message from the system will provide variables from a. to f.. 

A sequence of user messages will provide g. divided in chunks. These will be delimited by a message saying "Code start" and another one saying "Code end".

If "g. Code" is not code that can be interpreted in "e. Programming language used" respond only with the following string response: "Incorrect input, please submit code on the appropriate language.".

Point "e. Tone to be used to reply" is more in regards to the attitude the wording of your replies has. Make sure to still follow the tone guidelines mentioned beforehand.

If "f. Format to be used to reply" is JSON, the output should be an array of JSON items, where each JSON represents an error found in the code. Have the fields for this response be the following:
- error_location (string)
- things_to_fix (string)
- suggestions (string)
- explanation (string)

Return only the JSON array. Not plaintext formatted as a JSON. Just the JSON array.

This should also be the default format for your replies. And again, please be specific with your feedback.

Once these values are given, please fulfill the initially stated prompt.
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

def get_analysis(configValues: str, code: list[str]):

  client = OpenAI(
    api_key=OPENAI_API_KEY,
    organization=ORG_ID
  )

  print("===Initial Prompt:")
  print(prompt)
  print(configValues)

  messages_to_send = [
    {"role": "system", "content": prompt},
    {"role": "system", "content": configValues},
    {"role": "user", "content": "Code start"}
  ]

  # it's detecting the line numbers properly now, but this still needs some fixing
  # the issue lies now in how to properly slice this input since it's messing it up due to the \n
  # maybe it'll have to work with the arrays
  # also definitely add some more logic to the role cuz it's returning some weird answers
  
  print("Code Start ====")

  index_start = 0
  skip = 100
  index_end = index_start + skip
  # slice the code in chunks then for every chunk append the following message:
  while (index_end < len(code)):
    query = util.convert_code_array_to_numbered_str(code, index_start, index_end)
    messages_to_send.append({"role": "user", "content": query})
    print({"role": "user", "content": query})
    index_start = index_end
    index_end = index_end + skip if index_end + skip < len(code) else index_start + len(code) - index_start
    print(index_start, index_end)

  messages_to_send.append({"role": "user", "content": "Code end"})
  print("==== Code End")

  completion = client.chat.completions.create(
    model="gpt-4",
    messages=messages_to_send
  )

  response = completion.choices[0].message.content
  return response

# https://platform.openai.com/docs/guides/text-generation
# https://platform.openai.com/docs/assistants/tools/code-interpreter