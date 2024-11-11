from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
import os
import time

from openai import OpenAI

client = OpenAI()

app = Flask(__name__)
ALLOWED_EXTENSIONS = {
    "txt", # plaintext
    "cpp", "hpp", # c++
    "c", "h" # c
    "py", # python
    "js", "ts", # javascript, typescript
    "java", "jar" #java
    }

# Initialize the Assistant and Thread globally
assistant_id = ""
thread_id = ""

chat_history = [
    {"role": "system", "content": "You are a helpful assistant."},
]


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/upload", methods=["POST"])
def upload_file():

    if "file" not in request.files:
        return jsonify(success=False, message="No file part")

    file = request.files["file"]

    global assistant_id

    if file.filename == "":
        return jsonify(success=False, message="No selected file")
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)

        # Upload the file and add it to the Assistant (you could also add it to the message)
        uploaded_file = client.files.create(file=file.stream, purpose="assistants")
        assistant_files = client.beta.assistants.files.list(assistant_id=assistant_id)

        file_ids = [file.id for file in assistant_files.data]
        file_ids.append(uploaded_file.id)

        client.beta.assistants.update(
            assistant_id,
            file_ids=file_ids,
        )

        return jsonify(
            success=True,
            message="File uploaded successfully and added to the Assistant",
            filename=filename,
        )
    return jsonify(success=False, message="File type not allowed")

