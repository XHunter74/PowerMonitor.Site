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
import { getStringDate } from '../utils';



@Injectable({
    providedIn: 'root',
})
export class PowerService extends HttpService {

    constructor(http: HttpClient,
        authService: AuthService,
        @Optional() @SkipSelf() parentModule: PowerService) {
        super(http, parentModule, authService);
    }

    getVoltageAmperageData(date: Date): Observable<IVoltageAmperageModel[]> {
        const startDate = getStringDate(date);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', startDate)
            .set('_ts', new Date().getTime().toString());

        return this.get<IVoltageAmperageModel[]>('power/voltage-amperage', params);
    }

    getPowerDataStats(): Observable<IPowerDataStatsModel[]> {
        const now = new Date();
        const month = now.getMonth() + 1;
        let dayOfWeek = now.getDay();
        if (dayOfWeek === 0) {
            dayOfWeek = 7;
        }
        const params = new HttpParams()
            .set('_ts', new Date().getTime().toString())
            .set('month', month.toString())
            .set('dayOfWeek', dayOfWeek.toString());
        return this.get<IPowerDataStatsModel[]>('power/power-data-stats', params);
    }

    getPowerDataHourly(date: Date): Observable<IPowerDataHourlyModel[]> {
        const startDate = getStringDate(date);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', startDate)
            .set('_ts', new Date().getTime().toString());

        return this.get<IPowerDataHourlyModel[]>('power/power-data-hourly', params);
    }

    getPowerDataDaily(start: Date, finish: Date): Observable<IPowerDataDailyModel[]> {
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate)
            .set('_ts', new Date().getTime().toString());

        return this.get<IPowerDataDailyModel[]>('power/power-data-daily', params);
    }


    getPowerDataMonthly(start: Date, finish: Date): Observable<IPowerDataMonthlyModel[]> {
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate)
            .set('_ts', new Date().getTime().toString());

        return this.get<IPowerDataMonthlyModel[]>('power/power-data-monthly', params);
    }

    getPowerDataYearly(): Observable<IPowerDataYearlyModel[]> {
        const params = new HttpParams()
            .set('_ts', new Date().getTime().toString());
        return this.get<IPowerDataYearlyModel[]>('power/power-data-yearly', params);
    }

    getPowerFailuresHourlyData(start: Date, finish: Date): Observable<IPowerFailureModel[]> {
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate)
            .set('_ts', new Date().getTime().toString());

        return this.get<IPowerFailureModel[]>('power/power-availability', params);
    }

    getPowerFailuresDailyData(year: number, month: number): Observable<PowerFailureDailyModel[]> {
        const params = new HttpParams()
            .set('year', year.toString())
            .set('month', month.toString())
            .set('_ts', new Date().getTime().toString());

        return this.get<PowerFailureDailyModel[]>('power/power-availability-daily', params).pipe(
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
            .set('year', year.toString())
            .set('_ts', new Date().getTime().toString());

        return this.get<PowerFailureMonthlyModel[]>('power/power-availability-monthly', params).pipe(
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
        const params = new HttpParams()
            .set('_ts', new Date().getTime().toString());
        return this.get<PowerFailureYearlyModel[]>('power/power-availability-yearly', params)
            .pipe(
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
        const params = new HttpParams()
            .set('_ts', new Date().getTime().toString());
        return this.get<PowerConsumptionDto[]>('power-consumption/energy-data', params)
            .pipe(
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
        return this.delete(actionUrl);
    }

    addPowerMeteringRecord(newRecord: NewPowerMeteringDto): Observable<PowerConsumptionDto> {
        return this.post<PowerConsumptionDto>('power-consumption/energy-data', newRecord);
    }

    editPowerMeteringRecord(recordId: number, newRecord: NewPowerMeteringDto): Observable<PowerConsumptionDto> {
        const actionUrl = `power-consumption/energy-data/${recordId}`;
        return this.put<PowerConsumptionDto>(actionUrl, newRecord);
    }

}
