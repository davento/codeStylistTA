import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputService } from 'src/app/core/services/components/input.service';
// import { ProgLanguageService } from 'src/app/core/services/http/progLanguage.service';
// import { CourseService } from 'src/app/core/services/http/course.service';

@Component({
  selector: 'app-change-input',
  templateUrl: './change-input.component.html',
  styleUrls: ['./change-input.component.css']
})
export class ChangeInputComponent {

  code: string = '';

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
    // to call the backend functions
    // also use these later for when there's a database
    // private progLanguageService: ProgLanguageService,
    // private courseService: CourseService
    //private inputService: InputService
  ) {

  }

  codeForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
  });

  cleanCode() {
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

  evaluate() {

    // get stringified code
    const rawCode = this.codeForm.get('code')?.value;
    const stringifiedCode = JSON.stringify(rawCode).substring(1, (rawCode).length-1)

    const inputData = {
      code: stringifiedCode,
      programming_language: this.configForm.get('programmingLanguage')?.value,
      course: this.configForm.get('course')?.value,
      reply_tone: this.configForm.get('tone')?.value,
      reply_format: this.configForm.get('format')?.value,
    };

    // console.log(inputData);

    // TODO: function routing
    // create html service function to send the body to the backend

    // check what is up with the services
    // this.inputService.processInput().subscribe({
    //   next: (data) => {
    //     console.log(data);
    //     // send data to output component
    //   },
    // });

  }
}
