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
  isAPIOnline = false;

  constructor(
    private usersService: UsersService,
    private servicesService: ServicesService,
    private router: Router
  ) {
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
      try {
        await this.servicesService.pingApi();
        this.isAPIOnline = true;
      }
      catch (e) {
        this.isAPIOnline = false;
      }
    }, 10000)
  }
}
