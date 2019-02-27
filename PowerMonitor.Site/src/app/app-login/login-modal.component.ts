import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Validators } from '@angular/forms';
import { UsersService } from '../services/users-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-modal-component',
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

  static show(modalService: NgbModal) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    setTimeout(() => {
      const modalRef = modalService.open(LoginModalComponent, modalOptions);
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
    const userPassowrd = this.loginForm.get('password').value;
    await this.usersService
      .login(userName, userPassowrd)
      .then(data => {
        console.log('Authorized');
        this.activeModal.close('Close click');
        console.log('Return URL=', this.returnUrl);
        this.router.navigateByUrl(this.returnUrl);
      })
      .catch(e => {
        console.log('Unauthorized');
        this.errors = e.error;
      });
  }

  processCancel() {
    this.activeModal.close('Cancel click');
    this.router.navigateByUrl(this.returnUrl);
  }

  get userName() { return this.loginForm.get('userName'); }
  get password() { return this.loginForm.get('password'); }
}
