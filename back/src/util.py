from tiktoken import encoding_for_model
import json

def convert_code_str_to_array(code: str) -> list[str]:
    lines = []
    current_line = ""
    is_in_string = False
    string_delimiter = None
    is_triple_quote = False
    is_in_multiline_comment = False
    i = 0

    while i < len(code):
        char = code[i]
        next_char = code[i + 1] if i + 1 < len(code) else ""
        next_next_char = code[i + 2] if i + 2 < len(code) else ""

        # Handle block comments (JavaDoc /** ... */ and regular /* ... */)
        if not is_in_string and not is_in_multiline_comment and char == "/" and next_char == "*":
            is_in_multiline_comment = True
            current_line += "/*"
            i += 1  # Skip past the "*"
            if next_next_char == "*":  # JavaDoc detected
                current_line += "*"
                i += 1  # Skip past second "*"
        elif is_in_multiline_comment and char == "*" and next_char == "/":
            current_line += "*/"
            is_in_multiline_comment = False
            i += 1  # Skip past "/"
        elif is_in_multiline_comment and char == "\n":
            lines.append(current_line.rstrip())  # Store current line
            current_line = ""  # Start a new line
        elif not is_in_string and char in ('"', "'", "`"):
            is_in_string = True
            string_delimiter = char
            is_triple_quote = code[i:i+3] == char * 3  # Check for triple quote
            current_line += char
            if is_triple_quote:
                i += 2  # Skip the next two characters
        elif is_in_string and char == string_delimiter and not is_triple_quote and code[i - 1] != "\\":
            is_in_string = False
            string_delimiter = None
            current_line += char
        elif is_in_string and is_triple_quote and char == string_delimiter and next_char == string_delimiter and next_next_char == string_delimiter:
            is_in_string = False
            is_triple_quote = False
            string_delimiter = None
            current_line += "'''"
            i += 2
        elif char == "\n":
            lines.append(current_line.rstrip())  # Add the line to lines
            current_line = ""
        else:
            current_line += char

        i += 1

    if current_line.strip():
        lines.append(current_line.rstrip())  # Add the last line if necessary

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
