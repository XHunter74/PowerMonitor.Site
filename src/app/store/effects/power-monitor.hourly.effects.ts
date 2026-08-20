import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PowerService } from '../../services/power.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
    loadHourlyMonitorData,
    loadHourlyMonitorDataFailure,
    loadHourlyMonitorDataSuccess,
} from '../actions/power-monitor.hourly.actions';
import { MonitorHourlyState } from '../reducers/power-monitor.hourly.reducer';
import { IPowerDataDailyModel } from '../../models/power-data-daily.model';
import { IPowerDataHourlyModel } from '../../models/power-data-hourly.model';

@Injectable()
export class PowerMonitorHourlyEffects {
    private actions$ = inject(Actions);

    constructor(private powerService: PowerService) {}

    loadPowerMonitorHourlyData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadHourlyMonitorData),
            switchMap(({ date }) => {
                const currentDate = new Date();
                const isCurrentDay =
                    date.getDate() === currentDate.getDate() &&
                    date.getMonth() === currentDate.getMonth() &&
                    date.getFullYear() === currentDate.getFullYear();

                return this.powerService.getPowerDataHourly(date).pipe(
                    map((data) => {
                        const newState = this.createHourlyState(date, data);
                        if (isCurrentDay) {
                            newState.forecast = newState.powerAvg * 24;
                        }
                        return loadHourlyMonitorDataSuccess({ data: newState });
                    }),
                    catchError((error) => {
                        console.error('Error in hourlyData$:', error);
                        return of(loadHourlyMonitorDataFailure({ error }));
                    }),
                );
            }),
            catchError((error) => {
                console.error('Unexpected error in loadPowerMonitorHourlyData$:', error);
                return of(loadHourlyMonitorDataFailure({ error }));
            }),
        ),
    );

    /**
     * Creates the hourly state object with calculated values
     */
    private createHourlyState(date: Date, data: IPowerDataHourlyModel[]): MonitorHourlyState {
        const newState = {} as MonitorHourlyState;
        newState.data = data;
        newState.date = date;

        let powerSum = data.reduce((a, b) => a + b.power, 0);
        powerSum = Math.round(powerSum * 100) / 100;
        newState.powerSum = powerSum;
        newState.powerAvg = this.getAveragePower(date, powerSum, data);

        return newState;
    }

    getAveragePower(date: Date, powerSum: number, powerData: IPowerDataDailyModel[]): number {
        let powerAvg = 0;
        if (powerData && powerData.length > 1) {
            const today = new Date();
            if (
                today.getDate() === date.getDate() &&
                today.getMonth() === date.getMonth() &&
                today.getFullYear() === date.getFullYear()
            ) {
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
