import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Validators } from '@angular/forms';
import { UsersService } from '../services/users-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'login-modal-component',
  templateUrl: './login-modal.component.html',
})

export class LoginModalComponent implements OnInit {

  errors: string;
  returnUrl: string;

  loginForm = new FormGroup({
    userName: new FormControl('',
      [Validators.required]),
    password: new FormControl('',
      [Validators.required])
  });

  constructor(private usersService: UsersService,
    private route: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private router: Router) { }

  ngOnInit(): void {
    let userName = localStorage.getItem('user_name');
    this.loginForm.patchValue({
      userName: userName,
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || localStorage.getItem('last_url') || '/';
  }

  static show(modalService: NgbModal) {
    let modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    setTimeout(() => {
      const modalRef = modalService.open(LoginModalComponent, modalOptions);
    });
  }

  async tryLogin() {
    this.errors = '';
    console.log('Try to login...');
    let userName = this.loginForm.get('userName').value;
    let userPassowrd = this.loginForm.get('password').value;
    console.log(userName);
    console.log(userPassowrd);
    await this.usersService
      .login(userName, userPassowrd)
      .then(data => {
        console.log("Authorized");
        this.activeModal.close('Close click');
        console.log('Return URL=', this.returnUrl);
        this.router.navigateByUrl(this.returnUrl);
      })
      .catch(e => {
        console.log("Unauthorized");
        this.errors = e.error;
      });
  }

  get userName() { return this.loginForm.get('userName'); }
  get password() { return this.loginForm.get('password'); }
}
