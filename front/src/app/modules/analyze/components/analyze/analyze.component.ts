import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputService } from 'src/app/core/services/components/input.service';
import { Course } from 'src/app/shared/interfaces/Course';
import { Feedback } from 'src/app/shared/interfaces/Feedback';
import { ProgLanguage } from 'src/app/shared/interfaces/ProgLanguage';
import { Tone } from 'src/app/shared/interfaces/Tone';
import { Format } from 'src/app/shared/interfaces/Format';
import { LoadingState } from 'src/app/shared/enums/LoadingState';

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

  // Enums
  public LoadingState = LoadingState;

  // JSON files
  progLangs: ProgLanguage[] = progLangsJSON;
  courses: Course[] = coursesJSON;
  tones: Tone[] = tonesJSON;
  formats: Format[] = formatsJSON;

  // General data members
  code: string = '';
  response: Feedback[][] = [];
  evaluated: boolean = false;
  isLoading: number[] = [LoadingState.nothing];
  errorLog: string = '';
  success: boolean = false;
  incorrectInputMessage: string = "Incorrect input, please submit code on the appropriate language.";

  // Data members for file management
  fileList: File[] = [];
  acceptType: string[] = ['*/*'];
  multipleFilesAnalyzed: boolean = false;
  wrongFileType: boolean = false;

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

  startLoad(): Promise<void> {
    return new Promise((resolve) => {
      this.errorLog = '';
      this.evaluated = false;
      this.response = [];
      this.success = false;
      this.disableButtons();
      resolve();
    })
  }

  enableButtons() {
    (document.getElementById("clearbtn") as HTMLButtonElement).disabled = false;
    (document.getElementById("uploadbtn") as HTMLButtonElement).disabled = false;
    (document.getElementById("filebtn") as HTMLButtonElement).disabled = false;
    (document.getElementById("analysisbtn") as HTMLButtonElement).disabled = false;
  }

  disableButtons() {
    (document.getElementById("clearbtn") as HTMLButtonElement).disabled = true;
    (document.getElementById("uploadbtn") as HTMLButtonElement).disabled = true;
    (document.getElementById("filebtn") as HTMLButtonElement).disabled = true;
    (document.getElementById("analysisbtn") as HTMLButtonElement).disabled = true;
  }

  finishLoad() {
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
      // get all files added through the file upload button/panel
      const files = Array.from(inputElement.files);
      // consider only valid files
      const validFiles = files.filter((file) => this.fileIsValidType(file));
      this.fileList = validFiles;
      if (this.fileList.length == 0) {
        this.wrongFileType = true;
      } else {
        this.wrongFileType = false;
      }
      }
      if (inputElement) {
        inputElement.value = '';
      }
  }

  fileIsValidType(file: File): boolean {

    const result = this.acceptType.some((extension) => {
        extension = extension.trim().toLowerCase();
        const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        return fileExtension === extension;
    });

    console.log(`File ${file.name} validation result ${result}`);
    return result;
  }

  removeFile(index: number) {
    this.fileList.splice(index, 1);
    if (this.response) {
      this.response.splice(index, 1);
    }
    console.log(this.fileList);
  }

  async submit() {
    await this.startLoad();
    this.multipleFilesAnalyzed = false;

    // Get the code of each file and turn it into the code input
    if (this.fileList?.length > 0) {
      this.multipleFilesAnalyzed = true;
      await this.processFilesSequentially();
    }
    // Evaluate directly if using the text input option
    else {
      const index = 0;
      this.isLoading[index] = LoadingState.loading;
      await this.evaluate(this.code);
      this.isLoading[index] = LoadingState.done;
    }
    this.finishLoad();
  }

  async processFilesSequentially() {
    for (const [index, file] of this.fileList.entries()) {
      this.isLoading[index] = LoadingState.onQueue;
    }
    for (const [index, file] of this.fileList.entries()) {
      this.isLoading[index] = LoadingState.loading;
      const fileContent = await this.readFileContent(file);
      await this.evaluate(fileContent);
      this.isLoading[index] = LoadingState.done;
    }
  }

  readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
        console.log(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
    })
  }

  evaluate(code: string): Promise<void> {

    if (code == '') {
      this.errorLog = "No code uploaded as input. Please upload a file or upload text input.";
      return new Promise((reject) => {reject()});
    }

    return new Promise((resolve, reject) => {

      const inputData = {
        code: code,
        programming_language: this.configForm.get('programmingLanguage')?.value,
        course: this.configForm.get('course')?.value,
        reply_tone: this.configForm.get('tone')?.value,
        reply_format: this.configForm.get('format')?.value,
      };

      // TODO: retouches
      this.inputService.processInput(inputData).subscribe({
        // make the data be appended to response
        next: (data) => {
          console.log(data);
          if (data["error"]) {
            this.errorLog = data["error"];
            this.success = false;
          } else {
            this.response.push(data);
            console.log(this.response);
            this.success = true;
          }
          resolve();
        },
        // need to think of more error cases
        error: (error) => {
          console.log(error);
          this.errorLog = "Server error occurred.";
          reject(error);
        },
      });
    })
  }
}
