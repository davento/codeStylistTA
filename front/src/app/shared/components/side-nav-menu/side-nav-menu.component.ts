import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav-menu',
  templateUrl: './side-nav-menu.component.html',
  styleUrls: ['./side-nav-menu.component.css']
})
export class SideNavMenuComponent {
  options = [{
    name: 'Analyze',
    url: '/',
  }, {
    name: 'Edit forms',
    url: '/edit'
  }, {
    name: "Log in",
    url: '/login'
  },
  {
    name: 'Log out',
    url: '/logout'
  }];

  constructor(
    private router: Router,
  ) {

  }

  @Output() redirector: EventEmitter<string> = new EventEmitter();

  redirect(url: string) {
    this.router.navigate([url]);
    this.close();
  }

  close() {
    this.redirector.emit();
  }
}
