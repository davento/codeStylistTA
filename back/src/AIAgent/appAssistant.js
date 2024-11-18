import OpenAI from "openai";

const OPENAI_API_KEY = "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"
const ORG_ID = "org-tQQarliDkrBTI1WZcOgFmwJA"

let api_key=OPENAI_API_KEY;
let organization=ORG_ID;

const client = new OpenAI(api_key, organization);

// insert the prompt from the other doc; just make sure to leave things as variables so you can insert the rest on the query later
const prompt = "";

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