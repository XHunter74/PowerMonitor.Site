import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { UsersService } from '../services/users-service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-login-modal-component',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})

export class LoginModalComponent implements OnInit {

  errors: string;
  returnUrl: string;

  loginForm = new UntypedFormGroup({
    userName: new UntypedFormControl('',
      [Validators.required]),
    password: new UntypedFormControl('',
      [Validators.required])
  });

  constructor(
    private readonly dialogRef: MatDialogRef<LoginModalComponent>,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  static show(dialog: MatDialog, width?: string) {
    if (!width) {
      width = '500px';
    }
    setTimeout(() => {
      dialog.open(LoginModalComponent,
        {
          width,
          hasBackdrop: false
        });
    });
  }

  ngOnInit(): void {
    const userName = localStorage.getItem('user_name');
    this.loginForm.patchValue({
      userName: userName,
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || localStorage.getItem('last_url') || '/';
  }

  async tryLogin() {
    this.errors = '';
    console.log('Try to login...');
    const userName = this.loginForm.get('userName').value;
    const userPassword = this.loginForm.get('password').value;
    try {
      await this.usersService.login(userName, userPassword);
      console.log('Authorized');
      this.dialogRef.close('Close click');
      console.log('Return URL=', this.returnUrl);
      this.router.navigateByUrl(this.returnUrl);
    } catch (err) {
      console.log('Unauthorized');
      this.errors = err.error.message;
    }
  }

  processCancel() {
    this.dialogRef.close('Cancel click');
    this.router.navigate(['/']);
  }

  get userName() { return this.loginForm.get('userName'); }
  get password() { return this.loginForm.get('password'); }
}
