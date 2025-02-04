## To-do
MUSTS:
- [ ] Documentation
    - [ ] Background
    - [ ] Abstract
- [ ] Debugging
    - [X] Check for "" error
    - [X] Handle case where the first file/file in the middle is empty
    - [ ] Organize error codes
- [ ] Deployment
    - [ ] Get the app deployment-ready
    - [ ] Feedback for app (like/stars button)
    - [ ] Actually deploy it
    - [ ] Logging for errors

SHOULDS:
- [ ] Optimizations
    - [ ] Component division
    - [ ] GPT Assistant
    - [ ] Update Angular version

## To-fix, check and/or improve (later)
- Sometimes throws an error instead of the incorrect output message.
- Refactor the evaluate function with await and async.
- Guidelines for Python, Java and C++ are too long; summarize them + split them in files.
    - Turn each section into a message; program the behavior for that.
- Use a RAG and upload the code guidelines references there instead.
- Instructor view (interface, data CSVs for the parameters, bulk upload data script)
- Add token length verification if the guidelines + code is too long
- Update Angular version
- Debug output issues with the JSON format not always finishing/closing, starting with \```json```.