import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;

  constructor(private usersService: UsersService, private router: Router) {
    this.usersService.isAuthenticatedIn.subscribe(isLogin => {
      if (isLogin) {
        console.log('User successfully login');
      } else {
        console.log('User successfully logout');
        this.router.navigate(['/app-login']);
      }
    });
  }

  ngOnInit() {
    
  }

  ngOnDestroy() {
    //Close the Observable stream
    //this.usersService.isAuthenticatedIn.unsubscribe();
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
}
