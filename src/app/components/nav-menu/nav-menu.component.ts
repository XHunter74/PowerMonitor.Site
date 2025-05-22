import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InfoService } from '../../services/info-service';
import { AuthService } from '../../services/auth.service';
import { ChangeLanguageDialogComponent } from '../../dialogs/change-language-dialog/change-language-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Constants } from '../../constants';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  isExpanded = false;
  isAPIOnline: boolean;
  private timer;

  constructor(
    private readonly authService: AuthService,
    private readonly infoService: InfoService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.checkApiState();
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  ngOnInit() {
    this.authService.isAuthenticated.subscribe(isLogin => {
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
    return this.authService.isSignedIn;
  }

  isAdmin() {
    return this.authService.userRole && this.authService.userRole.toLowerCase() === Constants.AdminRole;
  }

  logout() {
    this.authService.logout();
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.checkApiState();
    }, Constants.PingApiDelay);
  }

  async changeLanguage() {
    this.collapse();
    await ChangeLanguageDialogComponent.show(this.dialog);
  }

  private checkApiState() {
    this.infoService.pingApi().subscribe({
      next: (state) => {
        this.isAPIOnline = state.response.toLowerCase() === Constants.PongResponse;
      },
      error: (e) => {
        console.error(e);
        this.isAPIOnline = false;
      }
    });
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
