import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PowerService } from '../../services/power.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FailuresYearlyState } from '../reducers/power-failures.yearly.reducer';
import {
    loadYearlyFailuresData,
    loadYearlyFailuresDataSuccess,
    loadYearlyFailuresDataFailure,
} from '../actions/power-failures.yearly.actions';

@Injectable()
export class PowerFailuresYearlyEffects {
    private actions$ = inject(Actions);

    constructor(private powerService: PowerService) {}

    loadPowerMonitorYearlyData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadYearlyFailuresData),
            mergeMap(({}) =>
                this.powerService.getPowerFailuresYearlyData().pipe(
                    mergeMap((data) => {
                        const newState = {} as FailuresYearlyState;
                        newState.data = data;
                        newState.totalPowerFailure = data.reduce((a, b) => a + b.duration, 0);
                        newState.failureAmount = data.reduce((a, b) => a + b.events, 0);

                        return of(loadYearlyFailuresDataSuccess({ data: newState }));
                    }),
                ),
            ),
            catchError((error) => of(loadYearlyFailuresDataFailure({ error }))),
        ),
    );
}
