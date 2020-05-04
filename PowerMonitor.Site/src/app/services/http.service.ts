import { HttpParams, HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UsersService } from './users-service';
import { Inject, Optional, SkipSelf } from '@angular/core';
import { HeaderItem } from './header.item';


export class HttpService {

    private baseUrl: string;

    constructor(private http: HttpClient,
        private userService: UsersService,
        @Inject('BASE_URL') baseUrl: string,
        @Optional() @SkipSelf() parentModule: HttpService) {
        this.baseUrl = baseUrl;
        if (parentModule) {
            throw new Error(
                `${this.constructor.name} is already loaded. Import it in the AppModule only`);
        }

    }

    async get<T>(actionUrl: string, params?: HttpParams): Promise<T> {
        const authToken = localStorage.getItem('auth_token');
        const headers = [];
        if (authToken) {
            const header = new HeaderItem();
            header.name = 'Authorization';
            header.value = `Bearer ${authToken}`;
            headers.push(header);
        }

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
                    try {
                        this.handleError(this.userService, e);
                    } catch {
                        reject({ error: 'Server error' });
                    }
                });
        });
        return promise;
    }

    async post<T>(actionUrl: string, body: any, params?: HttpParams) {
        const authToken = localStorage.getItem('auth_token');
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        });
        if (body instanceof FormData) {
            headers = new HttpHeaders({
                'Authorization': `${authToken}`
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
                    const error = this.handleError(this.userService, e);
                    if (error) {
                        reject(error);
                    }
                });
        });
        return promise;
    }

    async put<T>(actionUrl: string, body: any, params?: HttpParams) {
        const authToken = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        });

        const promise = new Promise<T>((resolve, reject) => {
            this.http
                .put<T>(`${this.baseUrl}${actionUrl}`, body, { headers, params })
                .toPromise()
                .then(data => {
                    resolve(data);
                })
                .catch(e => {
                    const error = this.handleError(this.userService, e);
                    if (error) {
                        reject(error);
                    }
                });
        });
        return promise;
    }

    async delete(actionUrl: string, body?: any, params?: HttpParams) {
        const authToken = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        });
        const promise = new Promise((resolve, reject) => {
            this.http
                .delete(`${this.baseUrl}${actionUrl}`, { headers, params })
                .toPromise()
                .then(data => {
                    resolve(data);
                })
                .catch(e => {
                    const error = this.handleError(this.userService, e);
                    if (error) {
                        reject(error);
                    }
                });
        });
        return promise;
    }

    handleError(userService: UsersService, error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            if (error.status === 401) {
                userService.logout();
                return null;
            }
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return error;
    }
}
