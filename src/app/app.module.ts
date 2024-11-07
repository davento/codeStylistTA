import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangeConfigModule } from './modules/change-config/change-config.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { FilesUploadModule } from './modules/files-upload/files-upload.module';
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
    ChangeConfigModule,
    FeedbackModule,
    FilesUploadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
