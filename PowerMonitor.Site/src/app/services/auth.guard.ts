import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsersService } from './users-service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UsersService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/app-login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    localStorage.setItem('last_url', state.url);
    return true;
  }
}

@Injectable()
export class OpenGuard implements CanActivate {
  constructor(private userService: UsersService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    localStorage.setItem('last_url', state.url);
    return true;
  }
}
