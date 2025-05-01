import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard {
  constructor(
    private readonly authService: AuthService,
    private router: Router) { }

  canActivate(state: RouterStateSnapshot) {

    if (!this.authService.isSignedIn) {
      this.router.navigate(['/app-login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    localStorage.setItem('last_url', state.url);
    return true;
  }
}

@Injectable()
export class OpenGuard {

  canActivate(state: RouterStateSnapshot) {
    localStorage.setItem('last_url', state.url);
    return true;
  }
}
