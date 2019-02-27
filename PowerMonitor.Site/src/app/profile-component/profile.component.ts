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
        confirmPassword: new FormControl('',
            [Validators.required,
            Validators.minLength(6)])
    });

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    changePassword() {

    }

    get password() { return this.profileForm.get('password'); }
    get confirmPassword() { return this.profileForm.get('confirmPassword'); }
}
