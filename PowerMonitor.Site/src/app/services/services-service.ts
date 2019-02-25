import { Injectable, Inject, Optional, SkipSelf } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UsersService } from './users-service';

import { ISystemInfo } from '../models/sysinfo.model';
import { IBoardInfoModel } from '../models/board-info.model';
import { ICalibrationCoefficients } from '../models/calibration-coefficients.model';
import { HttpService } from './http.service';


@Injectable({
    providedIn: 'root',
})
export class ServicesService extends HttpService {

    constructor(http: HttpClient,
        userService: UsersService,
        @Inject('BASE_URL') baseUrl,
        @Optional() @SkipSelf() parentModule: ServicesService) {
        super(http, userService, baseUrl, parentModule);
    }

    async getSystemInfo(): Promise<ISystemInfo> {
        const promise = this.get<ISystemInfo>('services/sysinfo');
        return promise;
    }

    async getBoardVersion(): Promise<IBoardInfoModel> {
        const promise = this.get<IBoardInfoModel>('services/board-build-date');
        return promise;
    }

    async uploadNewSketch(newSketch: File): Promise<string> {
        const formData: FormData = new FormData();
        formData.append('new-sketch', newSketch, newSketch.name);
        const promise = this.post<string>('services/upload-sketch', formData);
        return promise;
    }

    async getCalibrationCoefficients(): Promise<ICalibrationCoefficients> {
        const promise = this.get<ICalibrationCoefficients>('services/calibration-coefficients');
        return promise;
    }
}
