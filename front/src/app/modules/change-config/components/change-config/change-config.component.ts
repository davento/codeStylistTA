import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-config',
  templateUrl: './change-config.component.html',
  styleUrls: ['./change-config.component.css']
})
export class ChangeConfigComponent {

  constructor (
    private fb: FormBuilder
  ) {

  }

  configForm: FormGroup = this.fb.group({
    programmingLanguage: ['', [Validators.required]],
    course: ['', [Validators.required]],
    tone: ['', [Validators.required]],
    format: ['', [Validators.required]],
  });
}
