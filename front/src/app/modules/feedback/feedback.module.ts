import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackMainComponent } from './components/feedback-main/feedback-main.component';
import { MaterialModule } from 'src/app/core/material/material.module';

@NgModule({
  declarations: [
    FeedbackMainComponent
  ],
  exports: [
    FeedbackMainComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class FeedbackModule { }
