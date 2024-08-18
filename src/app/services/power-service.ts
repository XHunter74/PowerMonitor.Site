import { Injectable, Inject, Optional, SkipSelf } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { IVoltageAmperageModel } from '../models/voltage-amperage.model';
import { IPowerDataHourlyModel } from '../models/power-data-hourly.model';
import { IPowerDataDailyModel } from '../models/power-data-daily.model';
import { IPowerDataMonthlyModel } from '../models/power-data-monthly.model';
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

    async getPowerFailuresHourlyData(start: Date, finish: Date): Promise<IPowerFailureModel[]> {
        const startDate = getStringDate(start);
        const finishDate = getStringDate(finish);
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('finishDate', finishDate);

        const promise = this.get<IPowerFailureModel[]>('power/power-availability', params);
        return promise;
    }

    async getPowerFailuresDailyData(year: number, month: number): Promise<PowerFailureDailyModel[]> {
        const params = new HttpParams()
            .set('year', year.toString())
            .set('month', month.toString());

        let data = await this.get<PowerFailureDailyModel[]>('power/power-availability-daily', params);
        data = data.map(e => {
            const i = new PowerFailureDailyModel();
            i.year = e.year;
            i.month = e.month;
            i.day = e.day;
            i.eventDate = new Date(e.year, e.month - 1, e.day);
            i.duration = e.duration;
            i.events = e.events;
            return i;
        });
        return data;
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
        });
        return data;
    }

    async getPowerFailuresYearlyData(): Promise<PowerFailureYearlyModel[]> {
        let data = await this.get<PowerFailureYearlyModel[]>('power/power-availability-yearly');
        data = data.map(e => {
            const i = new PowerFailureMonthlyModel();
            i.year = e.year;
            i.eventDate = new Date(e.year, 0, 1);
            i.duration = e.duration;
            i.events = e.events;
            return i;
        });
        return data;
    }

    async getPowerConsumptionData(): Promise<PowerConsumptionDto[]> {
        const result = await this.get<PowerConsumptionDto[]>('power-consumption/energy-data');
        if (!result) {
            return [];
        }
        result.forEach(e => {
            e.eventDate = new Date(e.eventDate);
        });
        return result;
    }

    async deletePowerMeteringRecord(recordId: number) {
        const actionUrl = `power-consumption/energy-data/${recordId}`;
        await this.delete(actionUrl);
    }

    async addPowerMeteringRecord(newRecord: NewPowerMeteringDto): Promise<PowerConsumptionDto> {
        const createdRecord = await this.post<PowerConsumptionDto>('power-consumption/energy-data', newRecord);
        return createdRecord;
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
