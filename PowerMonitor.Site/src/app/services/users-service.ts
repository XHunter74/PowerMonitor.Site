import { Injectable, Inject, OnInit, Optional, SkipSelf } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { ITokenModel } from '../models/token.model';
import { timer } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl: string;

  constructor(private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') baseUrl,
    @Optional() @SkipSelf() parentModule: UsersService) {
    this.baseUrl = baseUrl;
    if (parentModule) {
      throw new Error(
        'UserService is already loaded. Import it in the AppModule only');
    }

  }

  private isLoginSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

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
    }
    let promise = new Promise((resolve, reject) => {
      this.http
        .post<ITokenModel>(this.baseUrl + 'auth/login', JSON.stringify(user), { headers })
        .toPromise()
        .then(data => {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user_name', userName);
          this.isLoginSubject.next(true);
          resolve();
        })
        .catch(e => {
          localStorage.removeItem('auth_token');
          this.isLoginSubject.next(false);
          reject({ error: "Invalid UserName/Password" });
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

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      if (error.status === 401) {
        this.logout();
        return null;
      }
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}

function showTime(currentDate) {
  console.log('Time', currentDate.getHours(), ':', currentDate.getMinutes(), ':', currentDate.getSeconds());
}
