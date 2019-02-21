import { Injectable, Inject, OnInit, Optional, SkipSelf } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UsersService } from './users-service';

import { catchError, retry } from 'rxjs/operators';
import { ISystemInfo } from '../models/sysinfo.model';
import { IVoltageAmperageModel } from '../models/voltage-amperage.model';
import { ServicesUtils } from './services-utils';
import { IPowerDataHourlyModel } from '../models/power-data-hourly.model';
import { IPowerDataDailyModel } from '../models/power-data-daily.model';
import { IPowerDataMonthlyModel } from '../models/power-data-monthly.model';
import { ISensorsDataModel } from '../models/sensors-data.model';
import { IPowerFailureModel } from '../models/power-failure.model';



const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root',
})
export class PowerService {
    private baseUrl: string;

    constructor(private http: HttpClient,
        private userService: UsersService,
        @Inject('BASE_URL') baseUrl,
        @Optional() @SkipSelf() parentModule: PowerService) {
        this.baseUrl = baseUrl;
        if (parentModule) {
            throw new Error(
                'PowerService is already loaded. Import it in the AppModule only');
        }

    }

    async getVoltageAmperageData(start: Date, finish: Date): Promise<IVoltageAmperageModel[]> {
        const authToken = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${authToken}`
        });
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate);

        const promise = new Promise<IVoltageAmperageModel[]>((resolve, reject) => {
            this.http
                .get<IVoltageAmperageModel[]>(this.baseUrl + 'power/voltage-amperage', { params, headers })
                .toPromise()
                .then(data => {
                    resolve(data);
                })
                .catch(e => {
                    try {
                        ServicesUtils.handleError(this.userService, e);
                    } catch {
                        reject({ error: 'Server error' });
                    }
                });
        });
        return promise;
    }

    async getPowerDataHourly(start: Date, finish: Date): Promise<IPowerDataHourlyModel[]> {
        const authToken = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${authToken}`
        });
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate);

        const promise = new Promise<IPowerDataHourlyModel[]>((resolve, reject) => {
            this.http
                .get<IPowerDataHourlyModel[]>(this.baseUrl + 'power/power-data-hourly', { params, headers })
                .toPromise()
                .then(data => {
                    resolve(data);
                })
                .catch(e => {
                    try {
                        ServicesUtils.handleError(this.userService, e);
                    } catch {
                        reject({ error: 'Server error' });
                    }
                });
        });
        return promise;
    }

    async getPowerDataDaily(start: Date, finish: Date): Promise<IPowerDataDailyModel[]> {
        const authToken = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${authToken}`
        });
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate);

        const promise = new Promise<IPowerDataDailyModel[]>((resolve, reject) => {
            this.http
                .get<IPowerDataDailyModel[]>(this.baseUrl + 'power/power-data-daily', { params, headers })
                .toPromise()
                .then(data => {
                    resolve(data);
                })
                .catch(e => {
                    try {
                        ServicesUtils.handleError(this.userService, e);
                    } catch {
                        reject({ error: 'Server error' });
                    }
                });
        });
        return promise;
    }

    async getPowerDataMonthly(start: Date, finish: Date): Promise<IPowerDataMonthlyModel[]> {
        const authToken = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${authToken}`
        });
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate);

        const promise = new Promise<IPowerDataMonthlyModel[]>((resolve, reject) => {
            this.http
                .get<IPowerDataMonthlyModel[]>(this.baseUrl + 'power/power-data-monthly', { params, headers })
                .toPromise()
                .then(data => {
                    resolve(data);
                })
                .catch(e => {
                    try {
                        ServicesUtils.handleError(this.userService, e);
                    } catch {
                        reject({ error: 'Server error' });
                    }
                });
        });
        return promise;
    }

    async getSensorsData(): Promise<ISensorsDataModel> {
        const authToken = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${authToken}`
        });

        const promise = new Promise<ISensorsDataModel>((resolve, reject) => {
            this.http
                .get<ISensorsDataModel>(this.baseUrl + 'power/sensors-data', { headers })
                .toPromise()
                .then(data => {
                    resolve(data);
                })
                .catch(e => {
                    try {
                        ServicesUtils.handleError(this.userService, e);
                    } catch {
                        reject({ error: 'Server error' });
                    }
                });
        });
        return promise;
    }

    async getPowerFailuresData(start: Date, finish: Date): Promise<IPowerFailureModel[]> {
        const authToken = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${authToken}`
        });
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate);

        const promise = new Promise<IPowerFailureModel[]>((resolve, reject) => {
            this.http
                .get<IPowerFailureModel[]>(this.baseUrl + 'power/power-availability', { params, headers })
                .toPromise()
                .then(data => {
                    resolve(data);
                })
                .catch(e => {
                    try {
                        ServicesUtils.handleError(this.userService, e);
                    } catch {
                        reject({ error: 'Server error' });
                    }
                });
        });
        return promise;
    }

}

function getStringDate(val: Date) {
    const dateStr = val.getFullYear().toString() + '-' + (val.getMonth() + 1).toString() +
        '-' + val.getDate().toString();
    return dateStr;
}
