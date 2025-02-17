from tiktoken import encoding_for_model
import json

def convert_code_str_to_array(code: str, language: str) -> list[str]:
    """
    Processes source code while preserving inline comments (//) and correctly handling:
    - Proper escaping of quotes in strings (" and ').
    - Escape sequences (\\, \", \n).
    - Multiline string formats (triple quotes for Python, backticks for JavaScript).
    - Multiline comments (/* ... */, #).
    - Unclosed or incorrectly started strings.
    - Single-line comments (//) without modifying them.

    Args:
        code (str): The source code as a string.
        language (str): The detected programming language (C, C++, Java, JavaScript, Python).

    Returns:
        list[str]: A list of processed code lines with correct escape handling.
    """

    lines = []
    is_in_string = False  # Tracks if inside a string
    string_delimiter = None  # Stores which quote type started the string
    is_multiline_string = False  # Tracks if a string continues across lines
    is_in_comment = False  # Tracks if inside a multiline comment

    # Set up language-specific rules
    if language in ["C", "C++", "Java", "JavaScript"]:
        single_line_comment = "//"
        multiline_comment_start = "/*"
        multiline_comment_end = "*/"
        string_types = {'"', "'"}
        supports_backticks = language == "JavaScript"  # JavaScript supports backticks

    elif language == "Python":
        single_line_comment = "#"
        multiline_comment_start = ('"""', "'''")  # Python uses triple quotes
        multiline_comment_end = ('"""', "'''")
        string_types = {'"', "'", '"""', "'''"}
        supports_backticks = False

    else:
        raise ValueError(f"Unsupported language: {language}")

    for line in code.splitlines():  # Process the code line by line
        processed_line = ""
        i = 0

        while i < len(line):
            char = line[i]

            # Preserve single-line comments (`//` or `#`)
            if not is_in_string and not is_in_comment and line[i:].startswith(single_line_comment):
                processed_line += line[i:]  # Keep the entire comment as is
                break  # Ignore further processing for this line

            # Detect start of a multiline comment
            if not is_in_string and not is_in_comment and line[i:].startswith(multiline_comment_start):
                is_in_comment = True
                processed_line += multiline_comment_start
                i += len(multiline_comment_start) - 1

            # Detect end of a multiline comment
            elif is_in_comment and line[i:].startswith(multiline_comment_end):
                is_in_comment = False
                processed_line += multiline_comment_end
                i += len(multiline_comment_end) - 1

            # Preserve content inside a comment
            elif is_in_comment:
                processed_line += char

            # Detect the start of a string and escape the opening quote
            elif not is_in_string and char in string_types:
                is_in_string = True
                string_delimiter = char
                if language == "Python" and i + 2 < len(line) and line[i:i+3] in string_types:
                    string_delimiter = line[i:i+3]  # Detect triple quotes for Python
                    processed_line += "\\" + string_delimiter
                    i += 2  # Skip next two chars
                else:
                    processed_line += "\\" + char  # Escape opening quote

            # Detect the end of a string (only if not preceded by a backslash)
            elif is_in_string and char == string_delimiter:
                if i > 0 and line[i - 1] != "\\":
                    is_in_string = False
                processed_line += "\\" + char  # Escape the closing quote

            # Handle escape sequences (`\` inside strings)
            elif is_in_string and char == "\\":
                processed_line += "\\\\"  # Convert `\` to `\\` to preserve it

            # Escape embedded double quotes inside a string
            elif is_in_string and char == "\"":
                processed_line += "\\\""  # Convert `"` to `\"` inside a string

            # Detect if a string continues across multiple lines with `+`
            elif is_in_string and char == "+" and i == len(line) - 1:
                is_multiline_string = True
                processed_line += char  # Keep the `+` for proper formatting

            # Handle unclosed strings at the end of a line
            elif is_in_string and i == len(line) - 1:
                processed_line += " \\\" (UNCLOSED STRING DETECTED) \\\""  # Auto-close with a warning
                is_in_string = False  # Reset state

            # Ensure backslashes at the end of a string are properly escaped
            elif is_in_string and char == "\\" and i == len(line) - 1:
                processed_line += "\\\\"  # Properly escape a trailing backslash

            # Handle JavaScript backticks
            elif supports_backticks and char == "`":
                if is_in_string and string_delimiter == "`":
                    is_in_string = False  # Close the backtick string
                else:
                    is_in_string = True
                    string_delimiter = "`"
                processed_line += "\\" + char  # Escape the backtick

            # Ensure single quotes (`'`) are not mistakenly escaped inside a string
            elif not is_in_string and char == "'":
                processed_line += char  # Keep single quotes unchanged

            # Process normal characters
            else:
                processed_line += char

            i += 1

        # Store the processed line
        lines.append(processed_line.rstrip())

        # If a string is continued (`+` at the end), keep tracking it
        if is_multiline_string:
            is_in_string = True  # Ensure next line is still inside the string
            is_multiline_string = False  # Reset the flag

    print_full_code_array(lines)

    return lines

# ---

# Print the code array per line
def print_full_code_array(code: list[str]) -> None:
    print("---Code:")
    i = 0
    while (i < len(code)):
      print(str(i+1) + " " + code[i])
      i += 1
    print ("-------")

# Same as above but within a delimited range
def print_code_array_start_end(code: list[str], start: int, end: int) -> None:
    print("---Code:\nStart:")
    i = start
    while (i < end+1):
      print(str(i))
      i += 1
    print ("\nEnd-------")

# Convert the code list into a string that simulates an array of strings
# Each element is a code line with the number of line at the start
def convert_code_array_to_numbered_str(code_array: list[str], index_start: int, index_end: int) -> str:
    i = index_start
    code_full = "["
    for i in range(index_start, index_end+1):
        code_line = '"' + str(i+1) + " " + code_array[i] + '"'
        if (i != index_end):
            code_line += ", "
        code_full += code_line
    code_full += "]"
    return code_full

# Function for counting the tokens in a string
def count_tokens_message(message, model="gpt-4"):
  encoding = encoding_for_model(model)
  return len(encoding.encode(message))

# Function for counting the tokens in a file
def count_tokens_file(file_path: str, model="gpt-4", chunk_size=100):
  encoding = encoding_for_model(model)
  total_tokens = 0
  with open(file_path, 'r', encoding='utf-8') as file:
    while True:
      chunk = file.read(chunk_size)
      if not chunk:
        break
      tokens = encoding.encode(chunk, disallowed_special=None)
      total_tokens += len(tokens)
  return total_tokens

# Function to create the message for guidelines
# Granted their content does not exceed the token limit
def create_guidelines_message(file_path: str, language_name: str, token_limit=8000):
  message = None
  if (count_tokens_file(file_path) < token_limit):
    guidelines = ""
    with open(file_path, 'rb') as guidelines_file:
      guidelines = guidelines_file.read()
    guidelines_prompt = '''To further educate yourself on {} coding standards, use the following information:\n{}'''.format(language_name, guidelines)
    # print(guidelines_prompt)
    message = {"role": "system", "content": guidelines_prompt}
  return message

# Function to clean up the response in case it starts with "```json" and ends with "```"
def clean_json_response(response: str) -> str:
    # Backtick verification
    if response.startswith("```json"):
        # Backtick removal
        cleaned_response = response[7:-3].strip()
        try:
            # Validate the cleaned response as JSON
            # Will raise a ValueError if not valid JSON
            json.loads(cleaned_response)
            return cleaned_response
        except json.JSONDecodeError:
            # If it's not valid JSON, raise an error
            raise ValueError("Invalid JSON format in response")
    
    # If the response doesn't start with "```json", return it unchanged
    else:
        return response
