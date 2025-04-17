import { Injectable, Inject, Optional, SkipSelf } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
        const params = new HttpParams()
            .set('_ts', new Date().getTime().toString())
        return this.getO<ISystemInfo>('services/sysinfo', params);
    }

    pingApi(): Observable<HealthState> {
        return this.postO<HealthState>('services/ping', null);
    }

    getBoardVersion(): Observable<IBoardInfoModel> {
        const params = new HttpParams()
            .set('_ts', new Date().getTime().toString())
        return this.getO<IBoardInfoModel>('services/board-build-date', params);
    }

    async uploadNewSketch(newSketch: File): Promise<string> {
        const formData: FormData = new FormData();
        formData.append('new-sketch', newSketch, newSketch.name);
        const promise = this.post<string>('services/upload-sketch', formData);
        return promise;
    }

    async getCalibrationCoefficients(): Promise<CalibrationCoefficients> {
        const params = new HttpParams()
            .set('_ts', new Date().getTime().toString())
        const promise = this.get<CalibrationCoefficients>('services/calibration-coefficients', params);
        return promise;
    }

    async setCalibrationCoefficients(coefficients: CalibrationCoefficients): Promise<string> {
        const promise = this.post<string>('services/calibration-coefficients', coefficients);
        return promise;
    }
}
