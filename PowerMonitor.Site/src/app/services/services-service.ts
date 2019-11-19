import { Injectable, Inject, Optional, SkipSelf } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { UsersService } from './users-service';

import { ISystemInfo } from '../models/sysinfo.model';
import { IBoardInfoModel } from '../models/board-info.model';
import { CalibrationCoefficients } from '../models/calibration-coefficients.model';
import { HttpService } from './http.service';
import { Constans } from '../constants';
import { HealthState } from '../models/health-state.model';
import { HeaderItem } from './header.item';
import { state } from '@angular/animations';


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

    async pingApi(): Promise<HealthState> {
        const actionUrl = Constans.healthUrl;
        const params = new HttpParams()
            .set('serviceName', Constans.ServiceName)
            .set('timeout', Constans.healthTimeout.toString());
        const apiKey = new HeaderItem();
        apiKey.name = 'api-key';
        apiKey.value = Constans.healthApiKey
        const states = await this.getExt<HealthState[]>(actionUrl, [apiKey], params);
        return states[0];
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

    async getCalibrationCoefficients(): Promise<CalibrationCoefficients> {
        const promise = this.get<CalibrationCoefficients>('services/calibration-coefficients');
        return promise;
    }

    async setCalibrationCoefficients(coefficients: CalibrationCoefficients): Promise<string> {
        const promise = this.post<string>('services/calibration-coefficients', coefficients);
        return promise;
    }
}
