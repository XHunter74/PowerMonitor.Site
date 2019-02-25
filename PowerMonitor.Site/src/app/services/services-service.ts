import { Injectable, Inject, Optional, SkipSelf } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { UsersService } from './users-service';

import { ISystemInfo } from '../models/sysinfo.model';
import { ServicesUtils } from './services-utils';
import { IBoardInfoModel } from '../models/board-info.model';
import { ICalibrationCoefficients } from '../models/calibration-coefficients.model';


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

    async getSystemInfo(): Promise<ISystemInfo> {
        const authToken = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${authToken}`
        });

        const promise = new Promise<ISystemInfo>((resolve, reject) => {
            this.http
                .get<ISystemInfo>(this.baseUrl + 'services/sysinfo', { headers })
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

    async getBoardVersion(): Promise<IBoardInfoModel> {
        const authToken = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${authToken}`
        });

        const promise = new Promise<IBoardInfoModel>((resolve, reject) => {
            this.http
                .get<IBoardInfoModel>(this.baseUrl + 'services/board-build-date', { headers })
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

    async uploadNewSketch(newSketch: File): Promise<IBoardInfoModel> {
        const authToken = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
            'Authorization': `${authToken}`
        });

        const formData: FormData = new FormData();
        formData.append('new-sketch', newSketch, newSketch.name);

        const promise = new Promise<IBoardInfoModel>((resolve, reject) => {
            this.http
                .post<IBoardInfoModel>(this.baseUrl + 'services/upload-sketch', formData, { headers })
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

    async getCalibrationCoefficients(): Promise<ICalibrationCoefficients> {
        const authToken = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${authToken}`
        });

        const promise = new Promise<ICalibrationCoefficients>((resolve, reject) => {
            this.http
                .get<ICalibrationCoefficients>(this.baseUrl + 'services/calibration-coefficients', { headers })
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
