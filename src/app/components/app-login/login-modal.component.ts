import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { UsersService } from '../../services/users-service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-login-modal-component',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.css'],
})
export class LoginModalComponent implements OnInit {
    returnUrl: string;

    loginForm = new UntypedFormGroup({
        userName: new UntypedFormControl('', [Validators.required]),
        password: new UntypedFormControl('', [Validators.required]),
    });

    constructor(
        private readonly dialogRef: MatDialogRef<LoginModalComponent>,
        private usersService: UsersService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private translate: TranslateService,
    ) {}

    static show(dialog: MatDialog, width?: string) {
        if (!width) {
            width = '400px';
        }
        dialog.open(LoginModalComponent, {
            width,
            height: '340px',
            hasBackdrop: false,
            disableClose: true,
        });
    }

    ngOnInit(): void {
        const userName = localStorage.getItem('user_name');
        this.loginForm.patchValue({
            userName: userName,
        });
        this.returnUrl =
            this.route.snapshot.queryParams['returnUrl'] || localStorage.getItem('last_url') || '/';
    }

    tryLogin() {
        console.log('Try to login...');
        const userName = this.loginForm.get('userName').value;
        const userPassword = this.loginForm.get('password').value;
        this.usersService.login(userName, userPassword).subscribe({
            next: () => {
                console.log('Authorized');
                this.dialogRef.close('Close click');
                console.log('Return URL=', this.returnUrl);
                this.router.navigateByUrl(this.returnUrl);
            },
            error: (err) => {
                console.log('Unauthorized: ', err.message);
                this.translate.get('ERRORS.AUTHENTICATION').subscribe((errorText) => {
                    ErrorDialogComponent.show(this.dialog, errorText);
                });
            },
        });
    }

    processCancel() {
        this.dialogRef.close('Cancel click');
        this.router.navigate(['/']);
    }

    get userName() {
        return this.loginForm.get('userName');
    }
    get password() {
        return this.loginForm.get('password');
    }
}
