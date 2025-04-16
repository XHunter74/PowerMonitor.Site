import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of, from } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users-service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  // Tracks if a token refresh is in progress
  private isRefreshingToken = false;

  // Used to queue requests while refreshing token
  private tokenRefreshSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip token for refresh token requests
    if (this.isRefreshTokenRequest(request)) {
      return next.handle(request);
    }

    // Add auth token if available
    const authToken = this.getAuthToken();
    if (authToken) {
      request = this.addTokenToRequest(request, authToken);
    }

    // Process the request
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 unauthorized errors
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }

        // Propagate other errors
        return throwError(() => error);
      })
    );
  }

  /**
   * Adds the authentication token to the request headers
   */
  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  /**
   * Checks if this request is for token refresh
   */
  private isRefreshTokenRequest(request: HttpRequest<any>): boolean {
    return request.url.includes('auth/refresh-token');
  }

  /**
   * Gets the current auth token from storage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Gets the current refresh token from storage
   */
  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Handles 401 unauthorized errors by attempting to refresh the token
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = this.getRefreshToken();

    // If no refresh token is available, propagate the error
    if (!refreshToken) {
      this.authService.logout();
      return throwError(() => new Error('Authentication required'));
    }

    // If a refresh is already in progress, queue this request
    if (this.isRefreshingToken) {
      return this.queueRequestBehindRefresh(request, next);
    }

    // Start a new token refresh
    return this.performTokenRefresh(refreshToken, request, next);
  }

  /**
   * Performs the token refresh operation
   */
  private performTokenRefresh(refreshToken: string, request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.isRefreshingToken = true;
    this.tokenRefreshSubject.next(null);

    return from(this.usersService.refreshToken(refreshToken)).pipe(
      switchMap(token => {
        // Process the successful token refresh
        this.authService.processLogin(token);
        const newToken = this.getAuthToken();
        this.tokenRefreshSubject.next(newToken);

        // Retry the original request with the new token
        return next.handle(this.addTokenToRequest(request, newToken));
      }),
      catchError(error => {
        // Handle failed token refresh
        this.authService.logout();
        this.tokenRefreshSubject.next(null);
        return throwError(() => new Error('Token refresh failed'));
      }),
      finalize(() => {
        this.isRefreshingToken = false;
      })
    );
  }

  /**
   * Queues a request behind an ongoing token refresh
   */
  private queueRequestBehindRefresh(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.tokenRefreshSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        return next.handle(this.addTokenToRequest(request, token));
      })
    );
  }
}
