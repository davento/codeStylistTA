from tiktoken import encoding_for_model

# Conversion of of read code into a list/array in which each line is a string item in it
def convert_code_str_to_array(code: str) -> list[str]:
    lines = [""]  # List to store individual lines of code
    current_line = ""  # String to build the current line as we process the code
    i = 0  # Index to iterate through the code string

    while i < len(code):
        char = code[i]
        next_char = code[i + 1] if i + 1 < len(code) else ""
        next_next_char = code[i + 2] if i + 2 < len(code) else ""

        # Handle block comments (C/C++/Java style with /* ... */)
        if handle_multiline_comment(code, i, current_line, lines):
            i = skip_comment_end(code, i)
            continue

        # Handle single-line comments (C/C++/Java style with //)
        if handle_single_line_comment(code, i, current_line):
            break  # Since we're at the end of the line, break and process the next line

        # Handle string literals
        if handle_string_literals(code, i, current_line):
            i = skip_string_literal_end(code, i)
            continue
        
        # Handle escape sequences inside string literals
        if handle_escape_sequences(code, i, current_line):
            i += 1  # Skip the next character since it was already processed
        
        # Handle line breaks (end of a line)
        elif char == "\n":
            finalize_line(current_line, lines)
            current_line = ""  # Reset the current line to start a new one
        
        else:
            current_line += char  # Append normal characters to the current line
        
        i += 1  # Move to the next character

    finalize_line(current_line, lines)  # Finalize the last line if any

    print_full_code_array(lines)
    return lines

def handle_multiline_comment(code: str, i: int, current_line: str, lines: list[str]) -> bool:
    """Handle block comments (C/C++/Java style with /* ... */)"""
    if code[i] == "/" and code[i + 1] == "*":
        current_line += "/*"  # Start of the comment
        i += 2  # Skip past the "/*"

        # Continue processing the comment until we find the closing "*/"
        while i + 1 < len(code) and not (code[i] == "*" and code[i + 1] == "/"):
            if code[i] == "\n":  # If we encounter a newline inside the comment
                lines.append(current_line.rstrip())  # Add the comment line to the lines
                current_line = ""  # Start a new line for the next part of the comment
            else:
                current_line += code[i]  # Add the current character to the current line

            i += 1  # Move to the next character
        
        # Add the closing "*/" to the current line
        current_line += "*/"
        return True

    return False

def skip_comment_end(code: str, i: int) -> int:
    """Skip over the end of a block comment (*/)."""
    # We are already at the beginning of "*/", so we just need to skip these two characters.
    return i + 2

def handle_single_line_comment(code: str, i: int, current_line: str) -> bool:
    """Handle single-line comments (// in C/C++/Java)"""
    if code[i] == "/" and code[i + 1] == "/":
        current_line += code[i:]  # Append the comment to the current line
        return True
    return False

def handle_string_literals(code: str, i: int, current_line: str) -> bool:
    """Handle string literals (single, double, and triple quotes)."""
    # Handle triple-quoted strings (e.g., Python docstrings)
    if code[i] == "'" and code[i + 1] == "'" and code[i + 2] == "'":
        current_line += "'''"  # Start of a triple-quoted string
        return True
    elif code[i] in ('"', "'", "`"):  # Handle regular string literals
        current_line += code[i]  # Start of a single-line string literal
        return True
    return False

def skip_string_literal_end(code: str, i: int) -> int:
    """Skip over the end of a string literal."""
    while code[i] != '"' and code[i] != "'" and code[i] != "`":
        i += 1
    return i + 1  # Skip the closing quote

def handle_escape_sequences(code: str, i: int, current_line: str) -> bool:
    """Handle escape sequences inside string literals."""
    if code[i] == "\\":
        current_line += code[i:i+2]  # Append both the backslash and the escaped character
        return True
    return False

def finalize_line(current_line: str, lines: list[str]) -> None:
    """Finalize the current line and add it to the list of lines."""
    lines.append(current_line.rstrip())  # Remove trailing spaces and append the line

# ---

# Print the code array per line
def print_full_code_array(code: list[str]) -> None:
    print("---Code:")
    i = 0
    while (i < len(code)):
      print(str(i) + " " + code[i])
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
        code_line = '"' + str(i) + " " + code_array[i] + '"'
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
    guidelines_prompt = '''To further educate yourself on {} coding standards, consider the following information:\n{}'''.format(language_name, guidelines)
    print(guidelines_prompt)
    message = {"role": "system", "content": guidelines_prompt}
  return message


def upload_files():
   pass