import { Injectable, Inject, Optional, SkipSelf } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { IVoltageAmperageModel } from '../models/voltage-amperage.model';
import { IPowerDataHourlyModel } from '../models/power-data-hourly.model';
import { IPowerDataDailyModel } from '../models/power-data-daily.model';
import { IPowerDataMonthlyModel } from '../models/power-data-monthly.model';
import { IPowerDataYearlyModel } from '../models/power-data-yearly.model';
import { ISensorsDataModel } from '../models/sensors-data.model';
import { IPowerFailureModel } from '../models/power-failure.model';
import { PowerFailureMonthlyModel } from '../models/power-failure-monthly.model';
import { PowerFailureYearlyModel } from '../models/power-failure-yearly.model';
import { PowerFailureDailyModel } from '../models/power-failure-daily.model';
import { HttpService } from './http.service';
import { IPowerDataStatsModel } from '../models/power-data-stats.model';
import { PowerMeteringDto as PowerConsumptionDto } from '../models/power-metering.dto';
import { NewPowerMeteringDto } from '../models/new-power-metering.dto';
import { AuthService } from './auth.service';
import { map, Observable } from 'rxjs';



@Injectable({
    providedIn: 'root',
})
export class PowerService extends HttpService {

    constructor(http: HttpClient,
        authService: AuthService,
        @Optional() @SkipSelf() parentModule: PowerService) {
        super(http, parentModule, authService);
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

    getVoltageAmperageDataNew(date: Date): Observable<IVoltageAmperageModel[]> {
        const startDate = getStringDate(date);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', startDate);

        return this.getO<IVoltageAmperageModel[]>('power/voltage-amperage', params);
    }

    getPowerDataStats(): Observable<IPowerDataStatsModel[]> {
        return this.getO<IPowerDataStatsModel[]>('power/power-data-stats');
    }

    getPowerDataHourly(date: Date): Observable<IPowerDataHourlyModel[]> {
        const startDate = getStringDate(date);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', startDate);

        return this.getO<IPowerDataHourlyModel[]>('power/power-data-hourly', params);
    }

    getPowerDataDaily(start: Date, finish: Date): Observable<IPowerDataDailyModel[]> {
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate);

        return this.getO<IPowerDataDailyModel[]>('power/power-data-daily', params);
    }


    getPowerDataMonthly(start: Date, finish: Date): Observable<IPowerDataMonthlyModel[]> {
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate);

        return this.getO<IPowerDataMonthlyModel[]>('power/power-data-monthly', params);
    }

    getPowerDataYearly(): Observable<IPowerDataYearlyModel[]> {
        return this.getO<IPowerDataMonthlyModel[]>('power/power-data-yearly');
    }

    async getSensorsData(): Promise<ISensorsDataModel> {
        const promise = this.get<ISensorsDataModel>('power/sensors-data');
        return promise;
    }

    getPowerFailuresHourlyData(start: Date, finish: Date): Observable<IPowerFailureModel[]> {
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate);

        return this.getO<IPowerFailureModel[]>('power/power-availability', params);
    }

    getPowerFailuresDailyData(year: number, month: number): Observable<PowerFailureDailyModel[]> {
        const params = new HttpParams()
            .set('year', year.toString())
            .set('month', month.toString());

        return this.getO<PowerFailureDailyModel[]>('power/power-availability-daily', params).pipe(
            map(data => data.map(e => {
                const i = new PowerFailureDailyModel();
                i.year = e.year;
                i.month = e.month;
                i.day = e.day;
                i.eventDate = new Date(e.year, e.month - 1, e.day);
                i.duration = e.duration;
                i.events = e.events;
                return i;
            }))
        );
    }

    getPowerFailuresMonthlyData(year: number): Observable<PowerFailureMonthlyModel[]> {
        const params = new HttpParams()
            .set('year', year.toString());

        return this.getO<PowerFailureMonthlyModel[]>('power/power-availability-monthly', params).pipe(
            map(data => data.map(e => {
                const i = new PowerFailureMonthlyModel();
                i.year = e.year;
                i.month = e.month;
                i.eventDate = new Date(e.year, e.month - 1, 1);
                i.duration = e.duration;
                i.events = e.events;
                return i;
            }))
        );
    }

    getPowerFailuresYearlyData(): Observable<PowerFailureYearlyModel[]> {
        return this.getO<PowerFailureYearlyModel[]>('power/power-availability-yearly').pipe(
            map(data => data.map(e => {
                const i = new PowerFailureMonthlyModel();
                i.year = e.year;
                i.eventDate = new Date(e.year, 0, 1);
                i.duration = e.duration;
                i.events = e.events;
                return i;
            }))
        );
    }

    getPowerConsumptionData(): Observable<PowerConsumptionDto[]> {
        return this.getO<PowerConsumptionDto[]>('power-consumption/energy-data').pipe(
            map(result => {
                if (!result) {
                    return [];
                }
                return result.map(e => {
                    e.eventDate = new Date(e.eventDate);
                    return e;
                });
            })
        );
    }

    deletePowerMeteringRecord(recordId: number): Observable<void> {
        const actionUrl = `power-consumption/energy-data/${recordId}`;
        return this.deleteO(actionUrl);
    }

    addPowerMeteringRecord(newRecord: NewPowerMeteringDto): Observable<PowerConsumptionDto> {
        return this.postO<PowerConsumptionDto>('power-consumption/energy-data', newRecord);
    }

    async editPowerMeteringRecord(recordId: number, newRecord: NewPowerMeteringDto): Promise<PowerConsumptionDto> {
        const actionUrl = `power-consumption/energy-data/${recordId}`;
        const createdRecord = await this.put<PowerConsumptionDto>(actionUrl, newRecord);
        return createdRecord;
    }

}

function getStringDate(val: Date) {
    const dateStr = val.getFullYear().toString() + '-' + (val.getMonth() + 1).toString() +
        '-' + val.getDate().toString();
    return dateStr;
}
