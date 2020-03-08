import { Injectable, Inject, Optional, SkipSelf } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';

import { UsersService } from './users-service';

import { IVoltageAmperageModel } from '../models/voltage-amperage.model';
import { IPowerDataHourlyModel } from '../models/power-data-hourly.model';
import { IPowerDataDailyModel } from '../models/power-data-daily.model';
import { IPowerDataMonthlyModel } from '../models/power-data-monthly.model';
import { ISensorsDataModel } from '../models/sensors-data.model';
import { IPowerFailureModel } from '../models/power-failure.model';
import { PowerFailureMonthlyModel } from '../models/power-failure-monthly.model';
import { HttpService } from './http.service';
import { IPowerDataStatsModel } from '../models/power-data-stats.model';



@Injectable({
    providedIn: 'root',
})
export class PowerService extends HttpService {

    constructor(http: HttpClient,
        userService: UsersService,
        @Inject('BASE_URL') baseUrl,
        @Optional() @SkipSelf() parentModule: PowerService) {
        super(http, userService, baseUrl, parentModule);
    }

    async getVoltageAmperageData(start: Date, finish: Date): Promise<IVoltageAmperageModel[]> {
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate);

        const promise = this.get<IVoltageAmperageModel[]>('power/voltage-amperage', params);

        return promise;
    }

    async getPowerDataStats(): Promise<IPowerDataStatsModel[]> {
        const promise = this.get<IPowerDataStatsModel[]>('power/power-data-stats');
        return promise;
    }

    async getPowerDataHourly(start: Date, finish: Date): Promise<IPowerDataHourlyModel[]> {
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate);

        const promise = this.get<IPowerDataHourlyModel[]>('power/power-data-hourly', params);
        return promise;
    }

    async getPowerDataDaily(start: Date, finish: Date): Promise<IPowerDataDailyModel[]> {
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate);

        const promise = this.get<IPowerDataDailyModel[]>('power/power-data-daily', params);
        return promise;
    }

    async getPowerDataMonthly(start: Date, finish: Date): Promise<IPowerDataMonthlyModel[]> {
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate);

        const promise = this.get<IPowerDataMonthlyModel[]>('power/power-data-monthly', params);
        return promise;
    }

    async getSensorsData(): Promise<ISensorsDataModel> {
        const promise = this.get<ISensorsDataModel>('power/sensors-data');
        return promise;
    }

    async getPowerFailuresData(start: Date, finish: Date): Promise<IPowerFailureModel[]> {
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate);

        const promise = this.get<IPowerFailureModel[]>('power/power-availability', params);
        return promise;
    }

    async getPowerFailuresMonthlyData(year: number): Promise<PowerFailureMonthlyModel[]> {
        const params = new HttpParams()
            .set('year', year.toString());

        let data = await this.get<PowerFailureMonthlyModel[]>('power/power-availability-monthly', params);
        data = data.map(e => {
            const i = new PowerFailureMonthlyModel();
            i.year = e.year;
            i.month = e.month;
            i.eventDate = new Date(e.year, e.month - 1, 1);
            i.duration = e.duration;
            i.events = e.events;
            return i;
        })
        return data;
    }

}

function getStringDate(val: Date) {
    const dateStr = val.getFullYear().toString() + '-' + (val.getMonth() + 1).toString() +
        '-' + val.getDate().toString();
    return dateStr;
}
