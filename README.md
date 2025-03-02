# Code Stylist TA
Go Boiler Project
---

## About
Code style feedback tool for beginner programmers. Meant to help instructors guarantee their students are truly learning their course content and combat students complacency when using Generative Artificial Intelligence for coursework.

## Objectives
To make a tool that can help students improve their coding standards (comments, style, documentation, etc.). This tool is to be used for students to practice and get feedback before and after submission of their tasks. An additional aid for students to be able to submit something better, get more details and clarification on the feedback they can get from this additional point of view, so to speak.

Note that a teacher (assistant) would still be the one giving the final grade. Instructors are also considered as an additional user of this platform, by having an interface through which they can specify details about the course.

---

## Front-end

This project was generated with NextJS.

Go to the `/nextjs-frontend` folder and add `.env.local` with the same format as `.env.example`. Then, install the necessary libraries using `npm install` and once that is done, run `npm run dev` for a dev server. Navigate to `http://localhost:3000/`. The application will automatically reload if you change any of the source files.

## Back-end

Powered by Flask. Create a virtual environment with the [environment.yml](https://github.com/davento/codeStylistTA/blob/dev/back/environment.yml) file. Activate it and install the necessary libraries shown in [requirements.txt](https://github.com/davento/codeStylistTA/blob/dev/back/requirements.txt). After this, in the `/back` directory, add a file titled `users.csv` adding users in the format shown in `users_csv_example`. Then, run the app using ```flask --app app run --port 5001```.

## Deployment

Simply run `docker-compose up -d --build`, ensuring that both the .env.local in `/nextjs-frontend` and both `users.csv` and `.env` in `/back` are available and correctly initialized.

## Extra Resources

__**OpenAI API:**__
- [Text Generation](https://platform.openai.com/docs/guides/text-generation)
- [Code Interpreter](https://platform.openai.com/docs/assistants/tools/code-interpreter)

__**Code Standard Guidelines References**__
- [List of Guidelines Used](https://github.com/davento/codeStylistTA/blob/dev/back/guidelines_files/README.md)