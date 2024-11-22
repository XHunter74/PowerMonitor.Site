import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { UsersService } from '../services/users-service';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
})


export class ProfileComponent implements OnInit, OnDestroy {

    profileForm = new UntypedFormGroup({
        password: new UntypedFormControl('',
            [Validators.required,
            Validators.minLength(6)]),
        confirmPassword: new UntypedFormControl('')
    }, [this.checkPasswords]);

    constructor(private usersService: UsersService,
        private dialog: MatDialog, private translate: TranslateService) { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    async changePassword() {
        const userPassword = this.profileForm.get('password').value;
        try {
            await this.usersService.changePassword(userPassword);
            alert('Password was changed successfully!');

        } catch (err) {
            console.log(err);
            const errorText = await this.translate.get('ERRORS.COMMON').toPromise();
            setTimeout(() => ErrorDialogComponent.show(this.dialog, errorText));
        }
    }

    checkPasswords(group: UntypedFormGroup) { // here we have the 'passwords' group
        const password = group.controls.password.value;
        const confirmPassword = group.controls.confirmPassword.value;
        const error = password === confirmPassword ? null : { notMatch: true };
        if (error) {
            group.controls.confirmPassword.setErrors(error);
        }
        return null;
    }

    get password() { return this.profileForm.get('password'); }
    get confirmPassword() { return this.profileForm.get('confirmPassword'); }
}
