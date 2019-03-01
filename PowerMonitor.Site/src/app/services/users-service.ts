import { Injectable, Inject, Optional, SkipSelf } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { ITokenModel } from '../models/token.model';



@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl: string;

  constructor(private http: HttpClient,
    @Inject('BASE_URL') baseUrl,
    @Optional() @SkipSelf() parentModule: UsersService) {
    this.baseUrl = baseUrl;
    if (parentModule) {
      throw new Error(
        'UserService is already loaded. Import it in the AppModule only');
    }

  }

  private isLoginSubject = new Subject<boolean>();

  get isAuthenticatedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }

  async login(userName: string, password: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const user = {
      username: userName,
      password: password
    };

    const promise = new Promise((resolve, reject) => {
      this.http
        .post<ITokenModel>(this.baseUrl + 'auth/login', JSON.stringify(user), { headers })
        .toPromise()
        .then(data => {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user_name', userName);
          this.isLoginSubject.next(true);
          resolve();
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          this.isLoginSubject.next(false);
          reject({ error: 'Invalid UserName/Password' });
        });
    });
    return promise;
  }

  async changePassword(newPassword: string) {
    const authToken = localStorage.getItem('auth_token');
    let headers: HttpHeaders;
    if (authToken) {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${authToken}`
      });
    } else {
      headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }

    const passwordModel = {
      newPassword: newPassword
    };

    const promise = new Promise((resolve, reject) => {
      this.http
        .post<ITokenModel>(this.baseUrl + 'auth/change-password', JSON.stringify(passwordModel), { headers })
        .toPromise()
        .then(() => {
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    });
    return promise;
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.isLoginSubject.next(false);
  }

  isLoggedIn() {
    const loggedIn = !!localStorage.getItem('auth_token');
    return loggedIn;
  }

}

