import { Injectable, Inject, OnInit, Optional, SkipSelf } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UsersService } from './users-service';

import { catchError, retry } from 'rxjs/operators';



const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root',
})
export class ServicesService {
    private baseUrl: string;

    constructor(private http: HttpClient,
        private userService: UsersService,
        @Inject('BASE_URL') baseUrl,
        @Optional() @SkipSelf() parentModule: ServicesService) {
        this.baseUrl = baseUrl;
        if (parentModule) {
            throw new Error(
                'ServicesService is already loaded. Import it in the AppModule only');
        }

    }

    async getSampleData(): Promise<WeatherForecast[]> {
        const authToken = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${authToken}`
        });

        let promise = new Promise<WeatherForecast[]>((resolve, reject) => {
            this.http
                .get<WeatherForecast[]>(this.baseUrl + 'weather', { headers })
                .toPromise()
                .then(data => {
                    resolve(data);
                })
                .catch(e => {
                    reject({ error: "Server error" });
                });
        });
        return promise;
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            if (error.status === 401) {
                this.userService.logout();
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

export interface WeatherForecast {
    dateFormatted: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}
