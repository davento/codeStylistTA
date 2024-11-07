import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeConfigComponent } from './components/change-config/change-config.component';
import { MaterialModule } from 'src/app/core/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ChangeConfigComponent
  ],
  exports: [
    ChangeConfigComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChangeConfigModule { }
