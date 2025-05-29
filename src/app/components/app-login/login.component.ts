import { Component, AfterViewInit } from '@angular/core';
import { LoginModalComponent } from './login-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    standalone: false
})
export class AppLoginComponent implements AfterViewInit {
    constructor(private matDialog: MatDialog) {}

    ngAfterViewInit(): void {
        LoginModalComponent.show(this.matDialog);
    }
}
