import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PowerService } from '../../services/power.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { daysInMonth } from '../../shared/utils';
import {
    loadMonthlyMonitorData,
    loadMonthlyMonitorDataFailure,
    loadMonthlyMonitorDataSuccess,
} from '../actions/power-monitor.monthly.actions';
import { MonitorMonthlyState } from '../reducers/power-monitor.monthly.reducer';
import { IPowerDataMonthlyModel } from '../../models/power-data-monthly.model';
import { Constants } from '../../shared/constants';

@Injectable()
export class PowerMonitorMonthlyEffects {
    private actions$ = inject(Actions);

    constructor(private powerService: PowerService) {}

    loadPowerMonitorMonthlyData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadMonthlyMonitorData),
            mergeMap(({ date }) => {
                const startDate = new Date(date.getFullYear(), 0, 1);
                const finishDate = new Date(date.getFullYear(), 11, 31);
                return this.powerService.getPowerDataMonthly(startDate, finishDate).pipe(
                    mergeMap((data) => {
                        const newState = {} as MonitorMonthlyState;
                        newState.data = data;
                        newState.date = startDate;
                        let powerSum = 0;
                        powerSum = data.reduce((a, b) => a + b.power, 0);
                        powerSum = Math.round(powerSum * 100) / 100;
                        newState.powerSum = powerSum;
                        newState.powerAvg = this.getAveragePower(data);

                        return of(loadMonthlyMonitorDataSuccess({ data: newState }));
                    }),
                    catchError((error) => of(loadMonthlyMonitorDataFailure({ error }))),
                );
            }),
        ),
    );

    getAveragePower(powerData: IPowerDataMonthlyModel[]): number {
        let powerAvg = 0;
        if (powerData && powerData.length > 1) {
            const today = new Date();
            let reduceSum = 0;
            let powerSum = powerData
                .filter((a) => {
                    const reduceSumInt =
                        (a.year === today.getFullYear() && a.month === today.getMonth() + 1) ||
                        (a.year <= Constants.systemStartDate.getFullYear() &&
                            a.month <= Constants.systemStartDate.getMonth() + 1);
                    if (reduceSumInt) {
                        reduceSum++;
                    }
                    return !reduceSumInt;
                })
                .reduce((a, b) => a + b.power, 0);
            const powerSumCurrentMonth = powerData
                .filter((a) => {
                    const reduceSumInt =
                        a.year === today.getFullYear() && a.month === today.getMonth() + 1;
                    return reduceSumInt;
                })
                .reduce((a, b) => a + b.power, 0);

            if (reduceSum > 0) {
                let months = powerData.length - reduceSum;
                if (powerSumCurrentMonth && powerSumCurrentMonth > 0) {
                    months =
                        months +
                        today.getDate() / daysInMonth(today.getFullYear(), today.getMonth());
                    powerSum = powerSum + powerSumCurrentMonth;
                }
                powerAvg = powerSum / months;
            } else {
                powerAvg = powerSum / powerData.length;
            }
            powerAvg = Math.round(powerAvg * 100) / 100;
        }
        return powerAvg;
    }
}
