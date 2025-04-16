import { Injectable, Inject, Optional, SkipSelf } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISystemInfo } from '../models/sysinfo.model';
import { IBoardInfoModel } from '../models/board-info.model';
import { CalibrationCoefficients } from '../models/calibration-coefficients.model';
import { HttpService } from './http.service';
import { HealthState } from '../models/health-state.model';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class ServicesService extends HttpService {

    constructor(http: HttpClient,
        authService: AuthService,
        @Optional() @SkipSelf() parentModule: ServicesService) {
        super(http, parentModule, authService);
    }

    getSystemInfo(): Observable<ISystemInfo> {
        return this.getO<ISystemInfo>('services/sysinfo');
    }

    pingApi(): Observable<HealthState> {
        return this.postO<HealthState>('services/ping', null);
    }

    getBoardVersion(): Observable<IBoardInfoModel> {
        return this.getO<IBoardInfoModel>('services/board-build-date');
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
