import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesMainComponent } from './components/files-main/files-main.component';
import { MaterialModule } from 'src/app/core/material/material.module';


@NgModule({
  declarations: [
    FilesMainComponent
  ],
  exports: [
    FilesMainComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class FilesUploadModule { }
