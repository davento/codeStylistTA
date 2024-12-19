# Code Stylist TA
Go Boiler Project
---

## About
Code style feedback tool for beginner programmers. Meant to help instructors guarantee their students are truly learning their course content and combat students complacency when using Generative Artificial Intelligence for coursework.

## Objectives
To make a tool that can help students improve their coding standards (comments, style, documentation, etc.). This tool is to be used for students to practice and get feedback before and after submission of their tasks. An additional aid for students to be able to submit something better, get more details and clarification on the feedback they can get from this additional point of view, so to speak.

Note that a teacher (assistant) would still be the one giving the final grade. Instructors are also considered as an additional user of this platform, by having an interface through which they can specify details about the course.

## To-do
MUSTS:
- [ ] File upload
    - [ ] Interface and prompt modifications
    - [ ] Bulk upload data script
- [ ] Background for presentation
SHOULDS:
- [ ] Instructor view
    - [ ] Instructor interface
    - [ ] Data CSVs
FIXES:
- [ ] PDF references. `NOTE: NOT WORKING. MAKE SHORT VERSIONS`

## To-fix, check and/or improve (later)
- Sometimes throws an error instead of the incorrect output message.
- Refactor the evaluate function with await and async.
- Use a RAG and upload the code guidelines references there.

---

## Front-end

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.5.

Go to the `/front` folder, install the necessary libraries using `npm install` and once that is done, run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Back-end

Powered by Flask. Create a virtual environment with the [environment.yml](https://github.com/davento/codeStylistTA/blob/dev/back/environment.yml) file. Activate it to install the necessary libraries shown in [requirements.txt](https://github.com/davento/codeStylistTA/blob/dev/back/requirements.txt) and run the app using ```flask --app app run```.

## Extra Resources

__**OpenAI API:**__
- [Text Generation](https://platform.openai.com/docs/guides/text-generation)
- [Code Interpreter](https://platform.openai.com/docs/assistants/tools/code-interpreter)