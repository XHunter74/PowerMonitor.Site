import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PowerService } from '../../services/power.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
    loadDailyFailuresData,
    loadDailyFailuresDataFailure,
    loadDailyFailuresDataSuccess,
} from '../actions/power-failures.daily.actions';
import { FailuresDailyState } from '../reducers/power-failures.daily.reducer';
import { IPowerFailureModel } from '../../models/power-failure.model';

@Injectable()
export class PowerFailuresDailyEffects {
    private actions$ = inject(Actions);

    constructor(private powerService: PowerService) {}

    loadPowerMonitorDailyData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadDailyFailuresData),
            mergeMap(({ date }) =>
                this.powerService
                    .getPowerFailuresDailyData(date.getFullYear(), date.getMonth() + 1)
                    .pipe(
                        mergeMap((data) => {
                            const newState = {} as FailuresDailyState;
                            newState.data = data;
                            newState.date = date;
                            const maxPowerFailure = data.find(
                                (o) =>
                                    o.duration ===
                                    Math.max.apply(
                                        null,
                                        data.map((e) => e.duration),
                                    ),
                            );
                            if (maxPowerFailure) {
                                newState.maxPowerFailure = {} as IPowerFailureModel;
                                newState.maxPowerFailure.start = maxPowerFailure.eventDate;
                                newState.maxPowerFailure.finish = maxPowerFailure.eventDate;
                                newState.maxPowerFailure.duration = maxPowerFailure.duration;
                            } else {
                                newState.maxPowerFailure = null;
                            }
                            newState.totalPowerFailure = 0;
                            newState.totalPowerFailure = data.reduce((a, b) => a + b.duration, 0);
                            newState.failureAmount = data.reduce((a, b) => a + b.events, 0);

                            return of(loadDailyFailuresDataSuccess({ data: newState }));
                        }),
                        catchError((error) => of(loadDailyFailuresDataFailure({ error }))),
                    ),
            ),
        ),
    );
}
