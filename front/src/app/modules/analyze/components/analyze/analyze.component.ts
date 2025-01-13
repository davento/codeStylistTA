import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputService } from 'src/app/core/services/components/input.service';
import { Course } from 'src/app/shared/interfaces/Course';
import { Feedback } from 'src/app/shared/interfaces/Feedback';
import { ProgLanguage } from 'src/app/shared/interfaces/ProgLanguage';
import { Tone } from 'src/app/shared/interfaces/Tone';
import { Format } from 'src/app/shared/interfaces/Format';

// json imports
import coursesJSON from "src/app/shared/data/courses.json";
import progLangsJSON from "src/app/shared/data/programming_languages.json";
import formatsJSON from "src/app/shared/data/formats.json";
import tonesJSON from "src/app/shared/data/tones.json";

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

  // json file
  progLangs: ProgLanguage[] = progLangsJSON;
  courses: Course[] = coursesJSON;
  tones: Tone[] = tonesJSON;
  formats: Format[] = formatsJSON;

  // Files
  fileList: File[] = [];
  acceptType: string = '*/*';
  multipleFilesAnalyzed: boolean = false;

  constructor (
    private fb: FormBuilder,
    private inputService: InputService
  ) {
    console.log(progLangsJSON);
    console.log(coursesJSON);
    console.log(formatsJSON);
    console.log(tonesJSON);
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

  onLanguageChange() {
    const selectedLang = this.configForm.get('programmingLanguage')?.value;
    if (selectedLang) {
      this.acceptType = selectedLang.extensions;
      console.log(this.acceptType);
    }
    if (this.fileList.length > 0) {
      this.fileList = [];
    }
  }

  openFileDialog() {
    const fileInput = document.getElementById('file-button') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  handleFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files) {
      const files = Array.from(inputElement.files);
      this.fileList = files;
      }
    console.log(this.fileList);
  }

  removeFile(index: number) {
    this.fileList.splice(index, 1);
    console.log(this.fileList);
  }

  submit() {
    if (this.fileList?.length > 0) {
      // get the code of each file and turn it into the code input
      // then just evaluate
      this.multipleFilesAnalyzed = true;
      for (let file of this.fileList) {
        this.readFileContent(file);
      }
    }
    else {
      this.evaluate();
    }
  }

  readFileContent(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.code = reader.result as string;
      this.evaluate();
      console.log(this.code);
      // TO-DO: make sure each analysis is on a different "tab"
      // https://material.angular.io/components/tabs/overview
      // create tabs dynamically as analyses are ready
    };
    reader.readAsText(file);
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
