# C++ Coding Standards (Introductory CS Course)

## File Organization & Includes
- Place each class or major component in its own .h and .cpp files.
- Order includes:
- Corresponding header
- Standard library headers
- Third-party/library headers
- Other project headers

## Naming Conventions
- Classes/Structs: PascalCase (e.g., `StudentRecord`).
- Functions: camelCase or snake_case (e.g., `calculateGPA()` or `calculate_gpa()`).
- Variables: camelCase (e.g., `studentCount`).
- Constants/Enums: ALL_CAPS_WITH_UNDERSCORES (e.g., `MAX_STUDENTS`).
- Namespaces: lowercase (e.g., `namespace school { ... }`).

## Formatting & Layout
- Indent consistently (2 or 4 spaces; avoid tabs).
- Keep lines under 80-120 characters for readability.
- Place the opening brace on the same line (e.g., `if (...) {`).
- Separate logical sections of code with blank lines.

## Commenting & Documentation
- File and function comments must always be included, so make sure to point out if there is not any.
- Use clear, concise comments to explain intent (not obvious code).
- Use Doxygen-style (`///` or `/** ... */`) for functions/classes if required by your course.
- Avoid unnecessary or repetitive comments; let well-chosen names speak for themselves.

## Declarations & Initializations
- Declare and initialize variables close to where they are used (`int count = 0;`).
- Prefer using auto when the type is obvious or repetitive (e.g., `auto it = myVector.begin();`).
- Use uniform initialization (`int x{0};`) when possible.


## Memory Management
- Use standard library containers (`std::vector`, `std::array`, etc.) instead of raw arrays.
- Avoid raw pointers; use smart pointers (`std::unique_ptr`, `std::shared_ptr`) if pointers are necessary.
- Prefer stack allocation over heap allocation for simple objects.


## Functions & Methods
- Keep functions short and focused on a single task.
- Pass large objects by reference (e.g., `const Student& s`) instead of by value.
- Use const correctness (e.g., `int getAge() const;`) to indicate immutability.


## Classes & Structs
- Follow encapsulation; keep data members private whenever possible.
- Use constructors to properly initialize member variables.
- Keep a class’s responsibilities clear and cohesive.


## Control Statements & Loops
- Use range-based for loops (`for (auto& elem : container)`) when possible.
- Avoid deep nesting—extract logic into helper functions if necessary.
- No goto—use structured loops and conditionals.


## Type Safety
- Use enum class instead of plain enum for stronger type checking.
- Avoid C-style casts; use `static_cast`, `reinterpret_cast`, or `const_cast` where needed.

## General Best Practices
- Check return values of functions (e.g., I/O operations) to handle errors gracefully.
- Use standard library algorithms (`<algorithm>`) and data structures.
- Limit use of macros; prefer constexpr or inline functions.
- Write simple tests (e.g., basic unit tests) for critical code.