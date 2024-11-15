import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangeInputModule } from './modules/change-input/change-input.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { MaterialModule } from './core/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    ChangeInputModule,
    FeedbackModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
