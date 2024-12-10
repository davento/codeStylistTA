import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputService } from 'src/app/core/services/components/input.service';
import { Feedback } from 'src/app/shared/interfaces/Feedback';
// import { ProgLanguageService } from 'src/app/core/services/http/progLanguage.service';
// import { CourseService } from 'src/app/core/services/http/course.service';

@Component({
  selector: 'app-analyze',
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.css']
})
export class AnalyzeComponent {

  code: string = '';
  response?: Feedback[] = [];
  evaluated: boolean = false;
  isLoading: boolean = false;
  errorLog: string = '';
  success: boolean = false;
  incorrectInputMessage: string = "Incorrect input, please submit code on the appropriate language.";

  // csv file; make an instructor view
  progLangs: any[] = [
    {
      name: "Python",
      extensions: ["py"],
    },
    {
      name: "C++",
      extensions: ["cpp", "hpp", "h"],
    },
    {
      name: "JavaScript",
      extensions: ["js"],
    },
    {
      name: "Java",
      extensions: ["java"]
    },
    {
      name: "C",
      extensions: ["c", "h"]
    }
  ];

  courses: any[] = [
    {
      code: 15900,
      name: "C Programming",
      description: "Fundamental principles, concepts, and methods of programming in C, with emphasis on applications in the physical sciences and engineering. Basic problem solving and programming techniques; fundamental algorithms and data structures; and use of programming logic in solving engineering problems. Students are expected to complete assignments in a collaborative learning environment.",
      learning_outcomes: [
        "Understand the fundamental principles, concepts and methods of computer programming.",
        "Use the C programming language to developing solutions in the domains of physical sciences, mathematics, and engineering.",
        "Demonstrate the ability to function as part of a technical team to generate a solution to a programming problem.",
        "Analyze alternative algorithm designs to implement solutions that make efficient use of limited resources of the computer."
      ],
    },
    {
      code: 17600,
      name: "Data Engineering In Python",
      description: "The course introduces students to programming fundamentals in Python, including loops, functions and different data types, and provides an introduction to data engineering including working with common data formats and learning the basics of data wrangling. Students will format, extract, clean, filter, transform, search, combine, summarize, aggregate, and visualize a diverse range of data sets. Python libraries including MatPlotLib and Pandas are used.",
      learning_outcomes: [
        "Write Python code using loops, decision statements, and functions.",
        "Explain how arguments are passed in Python functions and how the scope of variables impacts execution.",
        "Use the operations on lists, tuples, and dictionaries to perform appropriate data manipulations.",
        "Using Matplotlib, create informative plots and other data visualizations. Explain the key qualities of good visualizations.",
        "Creating and manipulating DataFrames using Pandas.",
        "Create Python code as well as methods in Pandas to select, search, change, and summarize data in tables.",
        "Explain how to identify and fill in missing values in data." ,
        "Apply Pandas functions combine and merge datasets, perform a range of data aggregations, groupings and cross tabulations.",
        "Given multiple data sets, demonstrate how to summarize, transform, combine the data sets, and aggregate and visualize the resulting data set."
      ],
    },
    {
      code: 25100,
      name: "Data Structures And Algorithms",
      description: "Running time analysis of algorithms and their implementations, one-dimensional data structures, trees, heaps, additional sorting algorithms, binary search trees, hash tables, graphs, directed graphs, weighted graph algorithms, additional topics.",
      learning_outcomes: [
        "Understand fundamental data structures, fundamental algorithms, and their implementation."
      ]
    }
  ];

  tones: string[] = [
    "Formal",
    "Informal",
  ];

  formats: string[] = [
    "JSON",
    // "Report",
  ]

  constructor (
    private fb: FormBuilder,
    private inputService: InputService
    // also use these later for when there's a database
    // private progLanguageService: ProgLanguageService,
    // private courseService: CourseService
  ) {

  }

  codeForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
  });

  clearCode() {
    this.codeForm.reset();
    this.code = '';
    console.log(this.code);
  }

  uploadCode() {
    this.code = this.codeForm.get('code')?.value;
    console.log(this.code);
    alert("Code updated.");
  }

  configForm: FormGroup = this.fb.group({
    programmingLanguage: ['', [Validators.required]],
    course: ['', [Validators.required]],
    tone: ['', [Validators.required]],
    format: ['', [Validators.required]],
  });

  startLoad() {
    this.errorLog = '';
    this.evaluated = false;
    this.isLoading = true;
    this.response = [];
    this.success = false;
    this.disableButtons();
  }

  enableButtons() {
    (document.getElementById("clearbtn") as HTMLButtonElement).disabled = false;
    (document.getElementById("uploadbtn") as HTMLButtonElement).disabled = false;
    (document.getElementById("analysisbtn") as HTMLButtonElement).disabled = false;
  }

  disableButtons() {
    (document.getElementById("clearbtn") as HTMLButtonElement).disabled = true;
    (document.getElementById("uploadbtn") as HTMLButtonElement).disabled = true;
    (document.getElementById("analysisbtn") as HTMLButtonElement).disabled = true;
  }

  finishLoad() {
    this.isLoading = false;
    this.evaluated = true;
    this.enableButtons();
  }

  convertCodeToStringArray(code: string): string[] {
    const lines: string[] = [''];
    let currentLine = '';
    let isInString = false;
    let stringDelimiter: string | null = null;
    let isTripleQuote = false;
    let i = 0;

    while (i < code.length) {
      const char = code[i];
      const nextChar = code[i + 1] || '';
      const nextNextChar = code[i + 2] || '';

      if (!isInString && char === "'" && nextChar === "'" && nextNextChar === "'") {
        isInString = true;
        isTripleQuote = true;
        stringDelimiter = "'''";
        i += 2;
      } else if (isInString && isTripleQuote && char === "'" && nextChar === "'" && nextNextChar === "'") {
        isInString = false;
        isTripleQuote = false;
        stringDelimiter = null;
        i += 2;
      } else if (!isInString && (char == '"' || char === "'" || char === "`")) {
        isInString = true;
        stringDelimiter = char;
      } else if (isInString && char === stringDelimiter && !isTripleQuote && code[i-1] !== '\\') {
        isInString = false;
        stringDelimiter = null;
      } else if (isInString && char === '\\') {
        currentLine += char + nextChar;
        i++;
      }

      else if (char === '\n') {
        if (!isInString) {
            lines.push(currentLine.trimEnd());
            currentLine = '';
        } else {
            currentLine += char;
        }
      } else {
        currentLine += char;
      }

      i++;
    }

    lines.push(currentLine.trimEnd());

    return lines;
  }

  evaluate() {

    this.startLoad();

    const rawCode = this.codeForm.get('code')?.value;
    const parsedCode = this.convertCodeToStringArray(rawCode);
    console.log(parsedCode);

    // this works, it does make the array like it should
    // all is left is to separate the arrays into chunks
    // and then modify the prompt so that it sends separate messages
    // and then groups them all together in a summary

    const inputData = {
      code: parsedCode,
      programming_language: this.configForm.get('programmingLanguage')?.value,
      course: this.configForm.get('course')?.value,
      reply_tone: this.configForm.get('tone')?.value,
      reply_format: this.configForm.get('format')?.value,
    };

    this.inputService.processInput(inputData).subscribe({
      next: (data) => {
        console.log(data);
        if (data == this.incorrectInputMessage) {
          this.errorLog = this.incorrectInputMessage;
        } else {
          this.response = data;
          this.success = true;
        }
        this.finishLoad();
      },
      error: (error) => {
        console.log(error);
        this.errorLog = "Server error occurred.";
        this.finishLoad();
      },
    });
  }
}
