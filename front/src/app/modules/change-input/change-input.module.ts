import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeInputComponent } from './components/change-input/change-input.component';
import { MaterialModule } from 'src/app/core/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ChangeInputComponent
  ],
  exports: [
    ChangeInputComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChangeInputModule { }
