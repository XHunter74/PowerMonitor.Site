import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users-service';
import { Router } from '@angular/router';
import { ServicesService } from '../services/services-service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  isAPIOnline;

  constructor(
    private usersService: UsersService,
    private servicesService: ServicesService,
    private router: Router
  ) {
    this.checkApiState();
    this.startTimer();
  }

  ngOnInit() {
    this.usersService.isAuthenticatedIn.subscribe(isLogin => {
      if (isLogin) {
        console.log('User successfully login');
      } else {
        console.log('User successfully logout');
        this.router.navigate(['/app-login']);
      }
    });
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  isLoggedIn() {
    return this.usersService.isLoggedIn();
  }

  logout() {
    this.usersService.logout();
  }

  startTimer() {
    setInterval(async () => {
      await this.checkApiState();
    }, 20000);
  }

  private async checkApiState() {
    try {
      const state = await this.servicesService.pingApi();
      this.isAPIOnline = state.response.toLowerCase() === 'pong';
    } catch (e) {
      console.error(e);
      this.isAPIOnline = false;
    }
  }

  get apiState(): number {
    if (typeof this.isAPIOnline === 'undefined') {
      return 0;
    }
    if (!this.isAPIOnline) {
      return 1;
    }
    return 2;
  }
}
