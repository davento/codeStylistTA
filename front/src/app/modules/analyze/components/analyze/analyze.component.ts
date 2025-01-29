import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputService } from 'src/app/core/services/components/input.service';
import { Course } from 'src/app/shared/interfaces/Course';
import { Feedback } from 'src/app/shared/interfaces/Feedback';
import { ProgLanguage } from 'src/app/shared/interfaces/ProgLanguage';
import { Tone } from 'src/app/shared/interfaces/Tone';
import { Format } from 'src/app/shared/interfaces/Format';
import { LoadingState } from 'src/app/shared/enums/LoadingState';

// JSON imports
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
  analyzed: boolean = false;
  isLoading: number[] = [LoadingState.nothing];
  errorLog: string = '';
  success: boolean = false;
  incorrectInputMessage: string = "Incorrect input, please submit code on the appropriate language.";

  // Data members for file management
  fileList: File[] = [];
  acceptType: string[] = ['*/*'];
  fileInputIsPresent: boolean = false;
  wrongFileType: boolean = false;

  // Initializing FormBuilder and InputService
  constructor (
    private fb: FormBuilder,
    private inputService: InputService
  ) {
    console.log(progLangsJSON);
    console.log(coursesJSON);
    console.log(formatsJSON);
    console.log(tonesJSON);
  }

  // Initialize form for code text input
  codeForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
  });

  // Clear code text input
  clearCode() {
    this.codeForm.reset();
    this.code = '';
    console.log(this.code);
  }

  // Upload code text input
  uploadCode() {
    this.code = this.codeForm.get('code')?.value;
    console.log(this.code);
    alert("Code updated.");
  }

  // Initialize form for configuration input
  configForm: FormGroup = this.fb.group({
    programmingLanguage: ['', [Validators.required]],
    course: ['', [Validators.required]],
    tone: ['', [Validators.required]],
    format: ['', [Validators.required]],
  });

  // Reset values when starting an analysis
  startLoad(): Promise<void> {
    return new Promise((resolve) => {
      this.errorLog = '';
      this.analyzed = false;
      this.response = [];
      this.success = false;
      this.disableButtons();
      resolve();
    })
  }

  // Enabling buttons post-analysis
  enableButtons() {
    (document.getElementById("clearbtn") as HTMLButtonElement).disabled = false;
    (document.getElementById("uploadbtn") as HTMLButtonElement).disabled = false;
    (document.getElementById("filebtn") as HTMLButtonElement).disabled = false;
    (document.getElementById("analysisbtn") as HTMLButtonElement).disabled = false;
  }

  // Disabling buttons pre-analysis
  disableButtons() {
    (document.getElementById("clearbtn") as HTMLButtonElement).disabled = true;
    (document.getElementById("uploadbtn") as HTMLButtonElement).disabled = true;
    (document.getElementById("filebtn") as HTMLButtonElement).disabled = true;
    (document.getElementById("analysisbtn") as HTMLButtonElement).disabled = true;
  }

  // Set values when finishing an analysis
  finishLoad() {
    this.analyzed = true;
    this.enableButtons();
  }

  // Change accepted files for file input when the language is changed
  onLanguageChange() {
    const selectedLang = this.configForm.get('programmingLanguage')?.value;
    if (selectedLang) {
      this.acceptType = selectedLang.extensions;
      console.log(this.acceptType);
    }
    if (this.fileList.length > 0) {
      this.fileList = [];
      this.response = [];
    }
  }

  // Open file input dialog window
  openFileDialog() {
    const fileInput = document.getElementById('file-button') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // Behavior for loading file input
  handleFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files) {
      // Get all files added through the file upload button/panel
      const files = Array.from(inputElement.files);
      // Consider only valid files
      const validFiles = files.filter((file) => this.fileIsValidType(file));
      this.fileList.push(...validFiles);
      // Notify error if no valid files are attached
      if (this.fileList.length == 0) {
        this.wrongFileType = true;
      } else {
        this.wrongFileType = false;
      }
      }
      // Reset if no files are included
      if (inputElement) {
        inputElement.value = '';
      }
  }

  // Helper function for validating if a file fits the extensions asked
  // TODO: fix that files can't be repeated either
  fileIsValidType(file: File): boolean {
    const result = this.acceptType.some((extension) => {
        extension = extension.trim().toLowerCase();
        const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        return fileExtension === extension;
    });

    console.log(`File ${file.name} validation result ${result}`);
    return result;
  }

  // File removal behavior
  removeFile(index: number) {
    this.fileList.splice(index, 1);
    if (this.response) {
      this.response.splice(index, 1);
    }
    console.log(this.fileList);
  }

  //
  async submit() {
    // Pre-analysis behavior
    await this.startLoad();
    this.fileInputIsPresent = false;

    // Get the code of each file and turn it into the code input for analysis
    if (this.fileList?.length > 0) {
      this.fileInputIsPresent = true;
      await this.processFilesSequentially();
    }
    // Analyze directly if using the text input option
    else {
      const index = 0;
      this.isLoading[index] = LoadingState.loading;
      await this.analyze(this.code);
      this.isLoading[index] = LoadingState.done;
    }

    // Post-analysis behavior
    this.finishLoad();
  }

  // Helper function for processing file input
  async processFilesSequentially() {
    // Set all files loading state as queued
    for (const [index, file] of this.fileList.entries()) {
      this.isLoading[index] = LoadingState.onQueue;
    }
    // Analyzing one file at a time
    for (const [index, file] of this.fileList.entries()) {
      this.isLoading[index] = LoadingState.loading;
      const fileContent = await this.readFileContent(file);
      await this.analyze(fileContent);
      this.isLoading[index] = LoadingState.done;
    }
  }

  // Helper function to extract the content (code) of a file
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

  // Analyzing the code
  analyze(code: string): Promise<void> {

    // Verify if there is a valid input
    if (code == '') {
      this.errorLog = "No code uploaded as input. Please upload a file or upload text input.";
      return new Promise((reject) => {reject()});
    }

    // Do the analysis itself
    return new Promise((resolve, reject) => {

      // Group up all the input data
      const inputData = {
        code: code,
        programming_language: this.configForm.get('programmingLanguage')?.value,
        course: this.configForm.get('course')?.value,
        reply_tone: this.configForm.get('tone')?.value,
        reply_format: this.configForm.get('format')?.value,
      };

      // Send it to the back for analysis
      this.inputService.processInput(inputData).subscribe({
        // Append returned data to the result
        next: (data) => {
          // Display returned data on the console
          console.log(data);

          // Display errors if any
          if (data["error"]) {
            this.errorLog = data["error"];
            this.success = false;
          }

          // Add analysis result to the response
          else {
            this.response.push(data);
            console.log(this.response);
            this.success = true;
          }
          resolve();
        },

        // Return a server error if sending fails
        error: (error) => {
          console.log(error);
          this.errorLog = "Server error occurred.";
          reject(error);
          this.enableButtons();
          this.response = [];
        },
      });
    })
  }
}
