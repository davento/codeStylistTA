import OpenAI from "openai";

const OPENAI_API_KEY = "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"
const ORG_ID = "org-tQQarliDkrBTI1WZcOgFmwJA"

let api_key=OPENAI_API_KEY;
let organization=ORG_ID;

const client = new OpenAI(api_key, organization);

// insert the prompt from the other doc; just make sure to leave things as variables so you can insert the rest on the query later
const prompt = `
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
- error location
- things to fix
- suggestions
- explanation

This should also be the default format for your replies.
`;

const assistant = client.beta.assistants.create({
    name: "Code Stylist TA",
    instructions: prompt,
    tools: [{type: "code_interpreter"}],
    model: "gpt-4o"
});

const thread = client.beta.threads.create();

async function newThread() {
    const thread = client.beta.threads.create();
    console.log(thread);
};

// this query should be called by the controller with its respective parameters
// modify with try catch?
async function process(query) {
    const message = await client.beta.threads.messages.create(
        thread.id,
        {
            role: "user",
            content: query
        }
    );
    console.log(message);
    const run = client.beta.threads.runs.create_and_poll(
        thread.id,
        assistant.id,
        {
            instructions: "Please address the user as a student, unless specified otherwise."
        }
    );
    if (run.status == 'completed') {
        const messages = client.beta.threads.messages.list(
            thread.id
        );
        const response = messages.data[0].content[0].text.value;
        console.log(response);
        return response;
    } else {
        console.log(run.status);
        return {message: "Error ocurred."};
    }
};

// figure out how to export this
// maybe make a class and put all shit there and export said class
// async function process() { }
// process();