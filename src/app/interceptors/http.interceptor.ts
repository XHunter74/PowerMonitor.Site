import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of, from, timer } from 'rxjs';
import { catchError, filter, take, switchMap, finalize, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users-service';
import { UserTokenDto } from '../models/user-token.dto';
import { Constants } from '../constants';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  // Tracks if a token refresh is in progress
  private isRefreshingToken = false;

  // Used to queue requests while refreshing token
  private tokenRefreshSubject = new BehaviorSubject<string | null>(null);

  // Store the token expiration timestamp
  private tokenExpirationTime: number = 0;

  // Threshold before expiration to trigger refresh (in milliseconds)
  private readonly REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {
    // Initialize expiration time from existing token (if any)
    this.updateTokenExpirationTime();

    // Set up periodic token check
    this.setupTokenRefreshTimer();
  }

  /**
   * Updates the token expiration timestamp based on current token
   */
  private updateTokenExpirationTime(): void {
    const expiresInStr = localStorage.getItem('token_expires_in');
    if (expiresInStr) {
      const expiresInMs = parseInt(expiresInStr, 10);
      this.tokenExpirationTime = expiresInMs;
    }
  }

  /**
   * Sets up periodic token check to refresh before expiration
   */
  private setupTokenRefreshTimer(): void {
    timer(0, 60000) // Check every minute
      .subscribe(() => {
        // Only proceed if user is signed in
        if (!this.authService.isSignedIn()) {
          return;
        }

        const currentTime = Date.now();
        const timeUntilExpiry = this.tokenExpirationTime - currentTime;

        // If token will expire soon and we're not already refreshing, refresh it
        if (timeUntilExpiry > 0 && timeUntilExpiry < this.REFRESH_THRESHOLD && !this.isRefreshingToken) {
          const refreshToken = this.getRefreshToken();
          if (refreshToken) {
            this.refreshTokenSilently(refreshToken);
          }
        }
      });
  }

  /**
   * Refreshes the token silently without waiting for 401 errors
   */
  private refreshTokenSilently(refreshToken: string): void {
    this.isRefreshingToken = true;

    from(this.usersService.refreshToken(refreshToken))
      .pipe(
        tap((token: UserTokenDto) => {
          this.authService.processLogin(token);
          this.storeTokenExpiration(token.expiresIn);
          this.tokenRefreshSubject.next(token.token);
        }),
        catchError(error => {
          console.error('Silent token refresh failed:', error);
          return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        })
      )
      .subscribe();
  }

  /**
   * Stores token expiration time for proactive refresh
   */
  private storeTokenExpiration(expiresInSeconds: number): void {
    const expirationTime = Date.now() + (expiresInSeconds * 1000);
    localStorage.setItem('token_expires_in', expirationTime.toString());
    this.tokenExpirationTime = expirationTime;
  }

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
    return localStorage.getItem(Constants.AuthToken);
  }

  /**
   * Gets the current refresh token from storage
   */
  private getRefreshToken(): string | null {
    return localStorage.getItem(Constants.RefreshToken);
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
      tap((token: UserTokenDto) => {
        this.storeTokenExpiration(token.expiresIn);
      }),
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
