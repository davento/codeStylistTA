import { Component } from '@angular/core';
import { StateService } from './core/services/components/state.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'codeStylist';
  getScreenWidth: any;
  loaderGeneralApp!: Subscription;
  loadingDialog: any;

  constructor ( 
    private stateService: StateService,
    private dialogService: MatDialog
  ) {
    
  }
  
}