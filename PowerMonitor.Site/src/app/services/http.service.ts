import { HttpParams, HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UsersService } from './users-service';
import { Inject, Optional, SkipSelf } from '@angular/core';


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
        let headers: HttpHeaders;
        if (authToken) {
            headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            });
        } else {
            headers = new HttpHeaders({
                'Content-Type': 'application/json'
            });
        }

        const promise = new Promise<T>((resolve, reject) => {
            this.http
                .get<T>(`${this.baseUrl}${actionUrl}`, { params, headers })
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
                    try {
                        this.handleError(this.userService, e);
                    } catch {
                        reject({ error: 'Server error' });
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
        throw new Error(
            'Something bad happened; please try again later.');
    }
}
