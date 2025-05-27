import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PowerService } from '../../services/power.service';
import { catchError, map, mergeMap, toArray } from 'rxjs/operators';
import { from, of } from 'rxjs';
import {
    loadMonthlyFailuresData,
    loadMonthlyFailuresDataSuccess,
    loadMonthlyFailuresDataFailure,
} from '../actions/power-failures.monthly.actions';
import { FailuresMonthlyState } from '../reducers/power-failures.monthly.reducer';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PowerFailuresMonthlyEffects {
    private actions$ = inject(Actions);

    constructor(
        private powerService: PowerService,
        private translate: TranslateService,
    ) {}

    loadPowerMonitorMonthlyData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadMonthlyFailuresData),
            mergeMap(({ date }) =>
                this.powerService.getPowerFailuresMonthlyData(date.getFullYear()).pipe(
                    mergeMap((data) => {
                        return from(data).pipe(
                            mergeMap((element) =>
                                this.formatMonth(new Date(element.year, element.month - 1)).pipe(
                                    map((monthStr) => {
                                        element.monthStr = monthStr;
                                        return element;
                                    }),
                                ),
                            ),
                            toArray(),
                            mergeMap((updatedData) => {
                                const newState = {} as FailuresMonthlyState;
                                newState.data = updatedData;
                                newState.date = date;
                                newState.totalPowerFailure = updatedData.reduce(
                                    (a, b) => a + b.duration,
                                    0,
                                );
                                newState.failureAmount = updatedData.reduce(
                                    (a, b) => a + b.events,
                                    0,
                                );

                                return of(loadMonthlyFailuresDataSuccess({ data: newState }));
                            }),
                        );
                    }),
                    catchError((error) => of(loadMonthlyFailuresDataFailure({ error }))),
                ),
            ),
        ),
    );

    formatMonth(date: Date) {
        return this.translate
            .get(`MONTHS.M${date.getMonth()}`)
            .pipe(mergeMap((month) => of(`${month} ${date.getFullYear()}`)));
    }
}
