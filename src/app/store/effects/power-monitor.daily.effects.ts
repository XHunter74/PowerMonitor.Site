import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PowerService } from '../../services/power-service';
import { catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MonitorHourlyState } from '../reducers/power-monitor.hourly.reducer';
import { IPowerDataDailyModel } from '../../models/power-data-daily.model';
import { loadDailyMonitorData, loadDailyMonitorDataFailure, loadDailyMonitorDataSuccess } from '../actions/power-monitor.daily.actions';
import { daysInMonth, isCurrentMonth } from '../../utils';

@Injectable()
export class PowerMonitorDailyEffects {

    private actions$ = inject(Actions);

    constructor(private powerService: PowerService) { }

    loadPowerMonitorHourlyData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadDailyMonitorData),
            mergeMap(({ date }) => {
                const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
                const finishDate = new Date(date.getFullYear(), date.getMonth(),
                    daysInMonth(date.getFullYear(), date.getMonth() + 1));
                return this.powerService.getPowerDataDaily(startDate, finishDate).pipe(
                    mergeMap((data) => {
                        const newState = {} as MonitorHourlyState;
                        newState.data = data;
                        newState.date = startDate;
                        let powerSum = 0;
                        powerSum = data.reduce((a, b) => a + b.power, 0);
                        powerSum = Math.round(powerSum * 100) / 100;
                        newState.powerSum = powerSum;
                        newState.powerAvg = this.getAveragePower(date, powerSum, data);
                        newState.forecast = this.getPowerForecast(date, newState.powerAvg);

                        return of(loadDailyMonitorDataSuccess({ data: newState }));
                    }),
                    catchError((error) => of(loadDailyMonitorDataFailure({ error })))
                )
            }
            )
        )
    );

    getPowerForecast(date: Date, powerAvg: number): number {
        const currentDate = new Date();
        if (date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear()) {
            const days = daysInMonth(date.getFullYear(), date.getMonth() + 1);
            const forecastPower = powerAvg * days;
            return forecastPower;
        } else {
            return -1;
        }
    }

    getAveragePower(currentDate: Date, powerSum: number, powerData: IPowerDataDailyModel[]): number {
        let powerAvg = 0;
        if (powerData && powerData.length > 0) {
            let days = powerData.length;
            if (isCurrentMonth(currentDate)) {
                days = days - 1;
                const today = new Date();
                const partOfDay = (today.getHours() + today.getMinutes() / 60) / 24;
                days = days + partOfDay;
            }
            if (days > 0) {
                powerAvg = powerSum / days;
                powerAvg = Math.round(powerAvg * 100) / 100;
            }
        }
        return powerAvg;
    }
}



