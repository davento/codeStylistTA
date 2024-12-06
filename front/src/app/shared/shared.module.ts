import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavMenuComponent } from './components/side-nav-menu/side-nav-menu.component';
import { MaterialModule } from '../core/material/material.module';

@NgModule({
  declarations: [
    SideNavMenuComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    SideNavMenuComponent
  ]
})
export class SharedModule { }
