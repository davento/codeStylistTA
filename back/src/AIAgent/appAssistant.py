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
course = ''
programmingLanguage = ''
code = ''
tone = ''


prompt = f'''

Imagine you're a professor in computer science at Purdue University. 
You are teaching an introductory programming class, to the likes of "{course}." 
Your class is using {programmingLanguage} as its main programming language. 
Using the information on the following link https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines to educate yourself on C++ coding standards, 
you must provide specific feedback for your student who has proposed the attached code for their homework. Be specific with the line numbers in which these issues are presented too.
{code}

Give the feedback on JSON formatting with fields called: error location, things to fix, suggestions, explanation.
'''

# assistant
assistant = client.beta.assistants.create(
  name="BoilerTAI",
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

# https://platform.openai.com/docs/assistants/tools/code-interpreter