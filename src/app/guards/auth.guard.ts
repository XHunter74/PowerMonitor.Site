import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsersService } from '../services/users-service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard  {
  constructor(
    private readonly authService: AuthService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (!this.authService.isSignedIn) {
      this.router.navigate(['/app-login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    localStorage.setItem('last_url', state.url);
    return true;
  }
}

@Injectable()
export class OpenGuard  {
  constructor(private userService: UsersService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    localStorage.setItem('last_url', state.url);
    return true;
  }
}
