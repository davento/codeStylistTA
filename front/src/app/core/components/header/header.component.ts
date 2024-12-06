import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() user: any;
  @Output() openSideNav: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private router: Router
  ) {

  }

  logOut() {
    // localStorage.removeItem('token');
    // localStorage.removeItem('jwt');
    this.router.navigate(['/']);
    this.user = undefined;
  }
}
