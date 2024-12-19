# function is currently getting rid of every string delimiter. fix that.
def convert_code_str_to_array(code: str) -> list[str]:
    lines = [""]
    current_line = ""
    is_in_string = False
    string_delimiter = None
    is_triple_quote = False
    i = 0

    while (i < len(code)):
        char = code[i]
        next_char = code[i+1] if i + 1 < len(code) else ""
        next_next_char = code[i+2] if i + 2 < len(code) else ""

        if not is_in_string and char == "'" and next_char == "'" and next_next_char == "'":
            is_in_string = True
            is_triple_quote = True
            string_delimiter = "'''"
            current_line += "'''"
            i += 2
        
        elif is_in_string and is_triple_quote and char == "'" and next_char == "'" and next_next_char == "'":
            is_in_string = False
            is_triple_quote = False
            string_delimiter = None
            current_line += "'''"
            i += 2
        
        elif not is_in_string and char in ('"', "'", "`"):
            is_in_string = True
            string_delimiter = char
            current_line += char
        
        elif is_in_string and char == string_delimiter and not is_triple_quote and code[i-1] != "\\":
            is_in_string = False
            string_delimiter = None
            current_line += char
        
        elif is_in_string and char == "\\":
            current_line += char + next_char
            i += 1
        
        elif char == "\n":
            if is_in_string:
                current_line += char
            else:
                lines.append(current_line.rstrip())
                current_line = ""
        
        else:
            current_line += char
        
        i += 1

    lines.append(current_line.rstrip())

    print_full_code_array(lines)

    return lines

def print_full_code_array(code: list[str]) -> None:
    print("---Code:")
    i = 0
    while (i < len(code)):
      print(str(i) + code[i])
      i += 1
    print ("-------")

def print_code_array_start_end(code: list[str], start: int, end: int) -> None:
    print("---Code:\nStart:")
    i = start
    while (i < end+1):
      print(str(i))
      i += 1
    print ("\nEnd-------")

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