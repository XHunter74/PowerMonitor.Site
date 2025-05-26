import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Optional, SkipSelf } from '@angular/core';
import { HeaderItem } from './header.item';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { catchError, Observable, retry, throwError, timeout } from 'rxjs';
import { Constants } from '../shared/constants';

export class HttpService {
    private baseUrl: string;

    constructor(
        private http: HttpClient,
        @Optional() @SkipSelf() parentModule: HttpService,
        public readonly authService: AuthService,
    ) {
        this.baseUrl = environment.apiUrl;
        if (parentModule) {
            throw new Error(
                `${this.constructor.name} is already loaded. Import it in the AppModule only`,
            );
        }
    }

    get<T>(actionUrl: string, params?: HttpParams, shouldRetry: boolean = true): Observable<T> {
        const headers = [];
        return this.getExt<T>(`${this.baseUrl}${actionUrl}`, headers, params, shouldRetry);
    }

    getExt<T>(
        actionUrl: string,
        headers: HeaderItem[],
        params?: HttpParams,
        shouldRetry: boolean = true,
    ): Observable<T> {
        let requestHeaders: HttpHeaders;
        if (headers && headers.length > 0) {
            requestHeaders = new HttpHeaders();
            headers.forEach((e) => {
                requestHeaders = requestHeaders.append(e.name, e.value);
            });
        }

        let request = this.http.get<T>(actionUrl, { params, headers: requestHeaders }).pipe(
            catchError((e: HttpErrorResponse) => {
                const error = this.handleError(this.authService, e);
                return throwError(() => error);
            }),
            timeout(Constants.RequestTimeout),
        );
        if (shouldRetry) {
            request = request.pipe(retry(Constants.RetryCount));
        }
        return request;
    }

    post<T>(
        actionUrl: string,
        body: any,
        params?: HttpParams,
        shouldRetry: boolean = true,
    ): Observable<T> {
        let headers = new HttpHeaders();
        if (!(body instanceof FormData)) {
            headers = new HttpHeaders({
                'Content-Type': 'application/json',
            });
        }
        let request = this.http
            .post<T>(`${this.baseUrl}${actionUrl}`, body, { headers, params })
            .pipe(
                catchError((e: HttpErrorResponse) => {
                    const error = this.handleError(this.authService, e);
                    return throwError(() => error);
                }),
                timeout(Constants.RequestTimeout),
            );

        if (shouldRetry) {
            request = request.pipe(retry(Constants.RetryCount));
        }

        return request;
    }

    put<T>(
        actionUrl: string,
        body: any,
        params?: HttpParams,
        shouldRetry: boolean = true,
    ): Observable<T> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        let request = this.http
            .put<T>(`${this.baseUrl}${actionUrl}`, body, { headers, params })
            .pipe(
                catchError((e: HttpErrorResponse) => {
                    const error = this.handleError(this.authService, e);
                    return throwError(() => error);
                }),
                timeout(Constants.RequestTimeout),
            );
        if (shouldRetry) {
            request = request.pipe(retry(Constants.RetryCount));
        }
        return request;
    }

    delete(
        actionUrl: string,
        body?: any,
        params?: HttpParams,
        shouldRetry: boolean = true,
    ): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        let request = this.http.delete(`${this.baseUrl}${actionUrl}`, { headers, params }).pipe(
            catchError((e: HttpErrorResponse) => {
                const error = this.handleError(this.authService, e);
                return throwError(() => error);
            }),
            timeout(Constants.RequestTimeout),
        );
        if (shouldRetry) {
            request = request.pipe(retry(Constants.RetryCount));
        }
        return request;
    }

    handleError(authService: AuthService, error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            if (error.status === 401) {
                if (!error.url.endsWith('api/auth/login')) {
                    authService.logout();
                    return null;
                } else {
                    return error;
                }
            } else if (error.status === 400 && error.error.message === 'Token does not exists') {
                authService.logout();
                return null;
            }
            console.error(
                `Backend returned code ${error.status}, ` +
                    `body was: ${JSON.stringify(error.error)}`,
            );
        }
        return error;
    }
}
