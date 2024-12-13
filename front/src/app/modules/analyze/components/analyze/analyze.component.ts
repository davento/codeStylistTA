import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputService } from 'src/app/core/services/components/input.service';
import { Course } from 'src/app/shared/interfaces/Course';
import { Feedback } from 'src/app/shared/interfaces/Feedback';
import { ProgLanguage } from 'src/app/shared/interfaces/ProgLanguage';

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

  // csv/json file + inputService to load them
  progLangs: ProgLanguage[] = [
    {
      name: "Python",
      extensions: ["py"],
      reference_material: ["https://peps.python.org/pep-0008/"]
    },
    {
      name: "C++",
      extensions: ["cpp", "hpp", "h"],
      reference_material: ["https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines"]
    },
    {
      name: "JavaScript",
      extensions: ["js"],
      reference_material: ["https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript"]
    },
    {
      name: "Java",
      extensions: ["java"],
      reference_material: ["https://github.com/piranhacloud/piranha/blob/current/CODE_CONVENTIONS.md"]
    },
    {
      name: "C",
      extensions: ["c", "h"],
      reference_material: ["https://www.cs.purdue.edu/homes/cs240/code.html"]
    },
    {
      name: "Rust",
      extensions: ["rs"],
      reference_material: ["https://doc.rust-lang.org/nightly/style-guide/"]
    }
  ];

  courses: Course[] = [
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
      code: 18000,
      name: "Problem Solving And Object-Oriented Programming",
      description: "Problem solving and algorithms, implementation of algorithms in a high level programming language, conditionals, the iterative approach and debugging, collections of data, searching and sorting, solving problems by decomposition, the object-oriented approach, subclasses of existing classes, handling exceptions that occur when the program is running, graphical user interfaces (GUIs), data stored in files, abstract data types, a glimpse at topics from other CS courses. Intended primarily for students majoring in computer sciences.",
      learning_outcomes: [
        "Understand solving problems by analyzing the problem, designing an algorithm, and programming the solution."
      ]
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
    // add configService when its created
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

  evaluate() {

    this.startLoad();

    const inputData = {
      code: this.code,
      programming_language: this.configForm.get('programmingLanguage')?.value,
      course: this.configForm.get('course')?.value,
      reply_tone: this.configForm.get('tone')?.value,
      reply_format: this.configForm.get('format')?.value,
    };

    // need to think of more error cases and fix this one
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
