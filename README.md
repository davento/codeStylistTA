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
- [ ] Documentation
    - [ ] Background
    - [ ] Abstract
    - [ ] Comments on files
        - [X] ~~`app.py`~~
        - [ ] `appAssistant.py`
        - [ ] `analyze.component`
        - [ ] `feedback-item.component`
- [X] ~~Debugging~~
    - [X] ~~Consider comments during code evaluation~~
    - [X] ~~Evaluate function for multiple files~~
    - [X] ~~Organize error codes~~
- [ ] Testing
    - [ ] Test for more files
    - [ ] Come up with metrics
    - [ ] Test the data
- [ ] Presentation
    - [ ] Slides
    - [ ] Practice THURSDAY 23RD 3:30 PM (teams online)

SHOULDS:
- [ ] Optimizations
    - [ ] Component division
    - [ ] Assistant
    - [ ] Update Angular version

## To-fix, check and/or improve (later)
- Sometimes throws an error instead of the incorrect output message.
- Refactor the evaluate function with await and async.
- Guidelines for Python, Java and C++ are too long; summarize them + split them in files.
    - Turn each section into a message; program the behavior for that.
- Use a RAG and upload the code guidelines references there instead.
- Instructor view (interface, data CSVs for the parameters, bulk upload data script)
---

## Front-end

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.5.

Go to the `/front` folder, install the necessary libraries using `npm install` and once that is done, run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Back-end

Powered by Flask. Create a virtual environment with the [environment.yml](https://github.com/davento/codeStylistTA/blob/dev/back/environment.yml) file. Activate it and install the necessary libraries shown in [requirements.txt](https://github.com/davento/codeStylistTA/blob/dev/back/requirements.txt). Then, run the app using ```flask --app app run```.

## Extra Resources

__**OpenAI API:**__
- [Text Generation](https://platform.openai.com/docs/guides/text-generation)
- [Code Interpreter](https://platform.openai.com/docs/assistants/tools/code-interpreter)

__**Code Standard Guidelines References**__
- [List of Guidelines Used](https://github.com/davento/codeStylistTA/blob/dev/back/guidelines_files/README.md)