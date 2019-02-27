import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { UsersService } from '../services/users-service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from './login-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppLoginComponent implements OnInit, AfterViewInit {

  constructor(private usersService: UsersService,
    private modalService: NgbModal,
    private router: Router) {

  }

  errors: string;

  loginForm: FormGroup;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'userName': new FormControl(
        '',
        [Validators.required,
        Validators.minLength(4)]
      ),
      'userPassword': new FormControl(
        '',
        [Validators.required,
        Validators.minLength(4)]
      ),

    });
    LoginModalComponent.show(this.modalService);
  }

  ngAfterViewInit(): void {

  }

  async login() {
    const modalRef = this.modalService.open(LoginModalComponent);
    return;
  }

  get userName() { return this.loginForm.get('userName'); }

  get userPassword() { return this.loginForm.get('userPassword'); }

}

