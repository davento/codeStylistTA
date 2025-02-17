from openai import OpenAI
import sys
sys.path.append("../src")
import src.util as util

# API keys
OPENAI_API_KEY = "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"
ORG_ID = "org-tQQarliDkrBTI1WZcOgFmwJA"

# Initializing the API client
client = OpenAI(
      api_key=OPENAI_API_KEY,
      organization=ORG_ID,
  )

# Initial prompt detailing the role/persona the AI will take
role_prompt = '''
You are a renowned professor of computer science at Purdue University with many years of experience on this institution. You are teaching an introductory programming class. The specifics of said course will be detailed to you in a future message. These details will include:
- Name of the course
- Description of the course
- Learning objectives of the course
With this context on mind, you must provide specific feedback for your student for their homework for this course. The code will be provided in a future message. You will be told which programming language was used for it. Make sure to keep the following guidelines for the tone of your response:
1. Be specific with the line numbers in which these issues are presented.
2. Make sure to point out if there are not any comments as well. Be specific of the functions or lines that need them the most.
3. Provide guidance on the academic aspect alone.
4. Keep responses concise and focused on the academic issue at hand. Do not provide any motivational closings or wishes for the student. 

Further, you must follow academic integrity guidelines. Therefore, the content of your responses should follow the following guidelines:

1. You must not write or share any piece of code, regardless of how many lines it is. 
2. While you can use student code as context to crafting your response, you must not debug or correct their code in any scenario. 

Once again, do not provide any code in any context.
'''

# Main instructions prompt detailing input to be received
instructions_prompt = '''
Given the initial prompt, consider the following variables:
a. Name of the course
b. Description of the course
c. Learning objectives of the course
d. Programming language used
e. Tone to use on reply
f. Format to use on reply
g. Code

An upcoming message from the system will provide values for variables a to f.

Point "e. Tone to be used to reply" refers to the wording of your replies. Make sure to still follow the tone guidelines mentioned beforehand.
'''

response_prompt = '''
If "f. Format to be used to reply" is JSON, the output should be an array of JSON items, where each JSON represents an error found in the code. Have the fields for this response be the following:
- error_location (string)
- things_to_fix (string)
- suggestions (string)
- explanation (string)

Return only the JSON array. Nothing more, nothing less.

This should also be the default format for your replies. And again, please be specific with your feedback.
'''

# Prompt clarifying the purpose and use of reference material input
reference_material_prompt = '''
Additionally, you will be given additional reading material for you to educate yourself on coding standards for the language the input code is in. Keep these into consideration during your assessment.
'''

# Prompt specifying instructions on the code input.
code_details_prompt = '''
A sequence of user messages will provide variable g, the code. This sequence is delimited by a message saying "Code start" and another one saying "Code end".

The format of the code is a list of strings, in which each string represents a line on the code. Every string starts with a number that represents its line number. The code starts after a space.

A chunk of this list will be provided on each message.

Note that there is a message reading (UNCLOSED STRING DETECTED) appended at the end of lines with unclosed quotes.

Once these values are given, please fulfill the initially stated prompt.
'''

# Analysis function
def get_analysis(configValues: str, code: list[str], guidelines: any=None):

  # Initialize client
  client = OpenAI(
    api_key=OPENAI_API_KEY,
    organization=ORG_ID
  )

  # Console checking of the initial system prompts
  # print("===Initial Prompt:")
  # print(role_prompt)
  # print(instructions_prompt)
  # print(configValues)

  messages_to_send = [
    {"role": "system", "content": role_prompt},
    {"role": "system", "content": instructions_prompt},
    {"role": "system", "content": response_prompt},
    {"role": "system", "content": configValues}
  ]

  # Creating guidelines message
  if (guidelines):
    guidelines_message = util.create_guidelines_message(guidelines[0], guidelines[1])
    # Assuming the guidelines are not too long and there weren't any errors during creation,
    if(guidelines_message):
      # append the guidelines message
      messages_to_send.append(guidelines_message)
    else:
      # exclude it
      print("Guidelines are too long. Excluding.\n\n")
  else:
    print("No guidelines provided.\n\n")
  
  # Start sending the code
  messages_to_send.append({"role": "user", "content": "Code start\n["})
  print("Total number of code lines: ", len(code))
  
  # slice the code in chunks and turn each chunk into a message:
  print("Code Start ====")
  skip = 100
  for index in range(-1, len(code)-1, skip):
    index_start = index+1
    index_end = index+skip if index+skip < len(code) else len(code)-1
    query = util.convert_code_array_to_numbered_str(code, index_start, index_end)
    print(query)
    print("---")
    messages_to_send.append({"role": "user", "content": query})
  messages_to_send.append({"role": "user", "content": "]\n Code end"})
  print("==== Code End")

  # Send all the messages
  completion = client.chat.completions.create(
    model="gpt-4o",
    messages=messages_to_send
  )

  # Return response
  response = completion.choices[0].message.content
  return response