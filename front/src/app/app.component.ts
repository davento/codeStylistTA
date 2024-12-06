import { Component, OnInit, ViewChild } from '@angular/core';
import { StateService } from './core/services/components/state.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'codeStylist';
  getScreenWidth: any;
  loaderGeneralApp!: Subscription;
  loadingDialog: any;
  user: any | undefined;

  @ViewChild('drawer') drawer: any;

  constructor (
    private stateService: StateService,
    private dialogService: MatDialog,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      // check if this will be needed
      if (event instanceof NavigationStart) {
        if (event.url === '/') {

        }
      }

      // activate authentication service here
    });
  }

  openSideNav() {
    console.log("Side nav opened");
    this.drawer.toggle();
  }
}
