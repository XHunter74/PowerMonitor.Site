import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of, from, timer } from 'rxjs';
import { catchError, filter, take, switchMap, finalize, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users-service';
import { UserTokenDto } from '../models/user-token.dto';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
    // Tracks if a token refresh is in progress
    private isRefreshingToken = false;

    // Used to queue requests while refreshing token
    private tokenRefreshSubject = new BehaviorSubject<string | null>(null);

    // Threshold before expiration to trigger refresh (in milliseconds)
    private readonly REFRESH_THRESHOLD = 60 * 1000; // 1 minute

    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {
        // Set up periodic token check
        this.setupTokenRefreshTimer();
    }

    /**
     * Sets up periodic token check to refresh before expiration
     */
    private setupTokenRefreshTimer(): void {
        timer(0, 60000) // Check every minute
            .subscribe(() => {
                // Only proceed if user is signed in
                if (!this.authService.isSignedIn) {
                    return;
                }

                const currentTime = Date.now();
                const timeUntilExpiry = this.authService.tokenExpiresIn - currentTime;

                // If token will expire soon and we're not already refreshing, refresh it
                if (
                    timeUntilExpiry > 0 &&
                    timeUntilExpiry < this.REFRESH_THRESHOLD &&
                    !this.isRefreshingToken
                ) {
                    const refreshToken = this.authService.refreshToken;
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

        this.usersService
            .refreshToken(refreshToken)
            .pipe(
                tap((token: UserTokenDto) => {
                    this.authService.processLogin(token);
                    this.tokenRefreshSubject.next(token.token);
                }),
                catchError((error) => {
                    console.error('Silent token refresh failed:', error);
                    return throwError(() => error);
                }),
                finalize(() => {
                    this.isRefreshingToken = false;
                }),
            )
            .subscribe();
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Skip token for refresh token requests
        if (this.isRefreshTokenRequest(request)) {
            return next.handle(request);
        }

        // Add auth token if available
        if (this.authService.authToken) {
            request = this.addTokenToRequest(request, this.authService.authToken);
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
            }),
        );
    }

    /**
     * Adds the authentication token to the request headers
     */
    private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    /**
     * Checks if this request is for token refresh
     */
    private isRefreshTokenRequest(request: HttpRequest<any>): boolean {
        return request.url.includes('auth/refresh-token');
    }

    /**
     * Handles 401 unauthorized errors by attempting to refresh the token
     */
    private handle401Error(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        // If no refresh token is available, propagate the error
        if (!this.authService.refreshToken) {
            this.authService.logout();
            return throwError(() => new Error('Authentication required'));
        }

        // If a refresh is already in progress, queue this request
        if (this.isRefreshingToken) {
            return this.queueRequestBehindRefresh(request, next);
        }

        // Start a new token refresh
        return this.performTokenRefresh(this.authService.refreshToken, request, next);
    }

    /**
     * Performs the token refresh operation
     */
    private performTokenRefresh(
        refreshToken: string,
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        this.isRefreshingToken = true;
        this.tokenRefreshSubject.next(null);

        return this.usersService.refreshToken(refreshToken).pipe(
            switchMap((token) => {
                // Process the successful token refresh
                this.authService.processLogin(token);
                const newToken = this.authService.authToken;
                this.tokenRefreshSubject.next(newToken);

                // Retry the original request with the new token
                return next.handle(this.addTokenToRequest(request, newToken));
            }),
            catchError((error) => {
                // Handle failed token refresh
                this.authService.logout();
                this.tokenRefreshSubject.next(null);
                return throwError(() => new Error('Token refresh failed'));
            }),
            finalize(() => {
                this.isRefreshingToken = false;
            }),
        );
    }

    /**
     * Queues a request behind an ongoing token refresh
     */
    private queueRequestBehindRefresh(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        return this.tokenRefreshSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => {
                return next.handle(this.addTokenToRequest(request, token));
            }),
        );
    }
}
