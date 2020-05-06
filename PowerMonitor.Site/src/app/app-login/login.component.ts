import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoginModalComponent } from './login-modal.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppLoginComponent implements OnInit, AfterViewInit {

  constructor(private matDialog: MatDialog) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    LoginModalComponent.show(this.matDialog);
  }
}

