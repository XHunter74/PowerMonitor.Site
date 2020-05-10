import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpSentEvent, HttpHeaderResponse,
  HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, from, empty } from 'rxjs';
import { map, catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UsersService } from './users-service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  private get authToken(): string { return localStorage.getItem('auth_token'); }
  private get refreshToken(): string { return localStorage.getItem('refresh_token'); }

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpSentEvent | HttpHeaderResponse |
      HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    if (request.url.indexOf('auth/refresh-token') !== -1) {
      return next.handle(request);
    }

    if (this.authToken) {
      const requestToHandle = request.clone({ headers: request.headers.set('authorization', `Bearer ${this.authToken}`) });
      return next.handle(requestToHandle)
        .pipe(catchError((error: HttpErrorResponse) => {
          switch (error.status) {
            case 401:
              const handleResult = this.handle401Error(request, next, error);
              return handleResult;
            default:
              return throwError(error);
          }
        }));
    } else {
      return next.handle(request);
    }
  }

  handle401Error(request: HttpRequest<any>, next: HttpHandler, error: HttpErrorResponse):
    Observable<HttpSentEvent | HttpHeaderResponse |
      HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    if (this.refreshToken) {
      if (!this.isRefreshingToken) {
        this.isRefreshingToken = true;
        this.tokenSubject.next(null);
        return from(this.usersService.refreshToken(this.refreshToken))
          .pipe(
            switchMap((token) => {
              this.isRefreshingToken = false;
              this.authService.processLogin(token);
              const requestToHandle = request.clone({ headers: request.headers.set('authorization', `Bearer ${this.authToken}`) });
              this.tokenSubject.next(true);
              return next.handle(requestToHandle);
            })
          );
      } else {
        return this.tokenSubject
          .pipe(
            filter(result => result),
            take(1),
            switchMap(() => {
              const requestToHandle = request.clone({ headers: request.headers.set('authorization', `Bearer ${this.authToken}`) });
              return next.handle(requestToHandle);
            }));
      }
    } else {
      throw (error);
    }
  }
}
