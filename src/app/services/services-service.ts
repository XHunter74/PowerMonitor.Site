import { Injectable, Optional, SkipSelf } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ISystemInfo } from '../models/sysinfo.model';
import { IBoardInfoModel } from '../models/board-info.model';
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
        return this.get<ISystemInfo>('services/sysinfo', params);
    }

    pingApi(): Observable<HealthState> {
        return this.post<HealthState>('services/ping', null);
    }

    getBoardVersion(): Observable<IBoardInfoModel> {
        const params = new HttpParams()
            .set('_ts', new Date().getTime().toString())
        return this.get<IBoardInfoModel>('services/board-build-date', params);
    }
}
