import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Optional, SkipSelf } from '@angular/core';
import { HeaderItem } from './header.item';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

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
                `${this.constructor.name} is already loaded. Import it in the AppModule only`);
        }

    }

    async get<T>(actionUrl: string, params?: HttpParams): Promise<T> {
        const headers = [];
        return await this.getExt<T>(`${this.baseUrl}${actionUrl}`, headers, params);
    }

    async getExt<T>(actionUrl: string, headers: HeaderItem[], params?: HttpParams): Promise<T> {
        let requestHeaders: HttpHeaders;
        if (headers && headers.length > 0) {
            requestHeaders = new HttpHeaders();
            headers.forEach(e => {
                requestHeaders = requestHeaders.append(e.name, e.value);
            });
        }

        const promise = new Promise<T>((resolve, reject) => {
            this.http
                .get<T>(actionUrl, { params, headers: requestHeaders })
                .toPromise()
                .then(data => {
                    resolve(data);
                })
                .catch(e => {
                    const error = this.handleError(this.authService, e);
                    if (error) {
                        reject(error);
                    }
                });
        });
        return promise;
    }

    async post<T>(actionUrl: string, body: any, params?: HttpParams) {
        let headers = new HttpHeaders();
        if (!(body instanceof FormData)) {
            headers = new HttpHeaders({
                'Content-Type': 'application/json',
            });
        }
        const promise = new Promise<T>((resolve, reject) => {
            this.http
                .post<T>(`${this.baseUrl}${actionUrl}`, body, { headers, params })
                .toPromise()
                .then(data => {
                    resolve(data);
                })
                .catch(e => {
                    const error = this.handleError(this.authService, e);
                    if (error) {
                        reject(error);
                    }
                });
        });
        return promise;
    }

    async put<T>(actionUrl: string, body: any, params?: HttpParams) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        const promise = new Promise<T>((resolve, reject) => {
            this.http
                .put<T>(`${this.baseUrl}${actionUrl}`, body, { headers, params })
                .toPromise()
                .then(data => {
                    resolve(data);
                })
                .catch(e => {
                    const error = this.handleError(this.authService, e);
                    if (error) {
                        reject(error);
                    }
                });
        });
        return promise;
    }

    async delete(actionUrl: string, body?: any, params?: HttpParams) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        const promise = new Promise((resolve, reject) => {
            this.http
                .delete(`${this.baseUrl}${actionUrl}`, { headers, params })
                .toPromise()
                .then(data => {
                    resolve(data);
                })
                .catch(e => {
                    const error = this.handleError(this.authService, e);
                    if (error) {
                        reject(error);
                    }
                });
        });
        return promise;
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
                `body was: ${JSON.stringify(error.error)}`);
        }
        return error;
    }
}
