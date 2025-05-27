import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PowerService } from '../../services/power.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
    loadHourlyFailuresData,
    loadHourlyFailuresDataFailure,
    loadHourlyFailuresDataSuccess,
} from '../actions/power-failures.hourly.actions';
import { FailuresHourlyState } from '../reducers/power-failures.hourly.reducer';

@Injectable()
export class PowerFailuresHourlyEffects {
    private actions$ = inject(Actions);

    constructor(private powerService: PowerService) {}

    loadPowerMonitorHourlyData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadHourlyFailuresData),
            mergeMap(({ date }) =>
                this.powerService.getPowerFailuresHourlyData(date, date).pipe(
                    mergeMap((data) => {
                        const newState = {} as FailuresHourlyState;
                        newState.data = data;
                        newState.date = date;
                        newState.maxPowerFailure = data.find(
                            (o) =>
                                o.duration ===
                                Math.max.apply(
                                    null,
                                    data.map((e) => e.duration),
                                ),
                        );
                        newState.totalPowerFailure = 0;
                        newState.totalPowerFailure = data.reduce((a, b) => a + b.duration, 0);
                        newState.failureAmount = data.length;

                        return of(loadHourlyFailuresDataSuccess({ data: newState }));
                    }),
                    catchError((error) => of(loadHourlyFailuresDataFailure({ error }))),
                ),
            ),
        ),
    );
}
