import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyzeComponent } from './components/analyze/analyze.component';
import { MaterialModule } from 'src/app/core/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeedbackItemComponent } from './components/analyze/feedback-item/feedback-item.component';

@NgModule({
  declarations: [
    AnalyzeComponent,
    FeedbackItemComponent
  ],
  exports: [
    AnalyzeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AnalyzeModule { }
