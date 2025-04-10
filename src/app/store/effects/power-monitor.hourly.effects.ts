import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PowerService } from '../../services/power-service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { loadHourlyMonitorData, loadHourlyMonitorDataFailure, loadHourlyMonitorDataSuccess } from '../actions/power-monitor.hourly.actions';
import { MonitorHourlyState } from '../reducers/power-monitor.hourly.reducer';
import { IPowerDataDailyModel } from '../../models/power-data-daily.model';
import { IPowerDataStatsModel } from '../../models/power-data-stats.model';
import { IPowerDataHourlyModel } from '../../models/power-data-hourly.model';

@Injectable()
export class PowerMonitorHourlyEffects {

    private actions$ = inject(Actions);

    constructor(private powerService: PowerService) { }

    loadPowerMonitorHourlyData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadHourlyMonitorData),
            mergeMap(({ date }) =>
                this.powerService.getPowerDataHourly(date).pipe(
                    mergeMap((data) => {
                        const newState = {} as MonitorHourlyState;
                        newState.data = data;
                        newState.date = date;
                        let powerSum = 0;
                        powerSum = data.reduce((a, b) => a + b.power, 0);
                        powerSum = Math.round(powerSum * 100) / 100;
                        newState.powerSum = powerSum;

                        newState.powerAvg = this.getAveragePower(date, powerSum, data);

                        const currentDate = new Date();
                        if (date.getDate() === currentDate.getDate() &&
                            date.getMonth() === currentDate.getMonth() &&
                            date.getFullYear() === currentDate.getFullYear()) {
                            return this.powerService.getPowerDataStats().pipe(
                                map((stats) => {
                                    const currentHour = currentDate.getHours();
                                    newState.forecast = this.getPowerForecast(currentHour, data, stats);
                                    return loadHourlyMonitorDataSuccess({ data: newState });
                                })
                            );
                        }
                        return of(loadHourlyMonitorDataSuccess({ data: newState }));
                    }),
                    catchError((error) => of(loadHourlyMonitorDataFailure({ error })))
                )
            )
        )
    );

    getPowerForecast(currentHour: number, powerData: IPowerDataHourlyModel[], powerDataStats: IPowerDataStatsModel[]): number {
        let result = 0;
        for (let i = 0; i < 24; i++) {
            const powerDataRecord = powerData.find(e => e.hours === i);
            const power = powerDataRecord ? powerDataRecord.power : 0;
            if (i < currentHour) {
                result += power;
            } else {
                if (power > powerDataStats[i].power) {
                    result += power;
                } else {
                    result += powerDataStats[i].power;
                }
            }
        }
        return result;
    }

    getAveragePower(date: Date, powerSum: number, powerData: IPowerDataDailyModel[]): number {
        let powerAvg = 0;
        if (powerData && powerData.length > 1) {
            const today = new Date();
            if (today.getDate() === date.getDate() &&
                today.getMonth() === date.getMonth() &&
                today.getFullYear() === date.getFullYear()) {
                {
                    const partOfDay = today.getHours() + today.getMinutes() / 60;
                    if (partOfDay > 0) {
                        powerAvg = powerSum / partOfDay;
                    }
                }
            } else {
                powerAvg = powerSum / 24;
            }
        }
        return powerAvg;
    }
}