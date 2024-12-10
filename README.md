# Code Stylist TA
Go Boiler Project
---

## About
Code style feedback tool for beginner programmers.

## Objectives
Make a tool that can help students improve their coding standards.

## To-do
- [ ] Instructor view
    - [ ] Instructor interface
    - [ ] Data CSVs
- [ ] File upload
    - [ ] Interface and prompt modifications
    - [ ] Bulk upload data script
- [ ] Chunking sent code / overlap windows
- [ ] Update prompt respectively

## To-fix / improve (later)
- Sometimes throws an error instead of the incorrect output message.
- Refactor the evaluate function with await and async.

---

## Front-end

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.5.

Go to the `/front` folder, install the necessary libraries using `npm install` and once that is done, run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Back-end

Powered by Flask. Create a virtual environment with the [environment.yml](https://github.com/davento/codeStylistTA/blob/dev/back/environment.yml) file. Activate it to install the necessary libraries shown in `requirements.txt` and run the app using ```flask --app app run```.