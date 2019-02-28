import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
})


export class ProfileComponent implements OnInit, OnDestroy {

    profileForm = new FormGroup({
        password: new FormControl('',
            [Validators.required,
            Validators.minLength(6)]),
        confirmPassword: new FormControl('')
    }, [this.checkPasswords]);

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    changePassword() {

    }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
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
