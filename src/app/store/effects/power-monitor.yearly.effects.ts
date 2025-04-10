import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PowerService } from '../../services/power-service';
import { catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { loadYearlyMonitorData, loadYearlyMonitorDataFailure, loadYearlyMonitorDataSuccess } from '../actions/power-monitor.yearly.actions';
import { MonitorYearlyState } from '../reducers/power-monitor.yearly.reducer';

@Injectable()
export class PowerMonitorYearlyEffects {

    private actions$ = inject(Actions);

    constructor(private powerService: PowerService) { }

    loadPowerMonitorYearlyData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadYearlyMonitorData),
            mergeMap(({ data }) => {
                return this.powerService.getPowerDataYearly().pipe(
                    mergeMap((data) => {
                        const newState = {} as MonitorYearlyState;
                        newState.data = data;

                        return of(loadYearlyMonitorDataSuccess({ data: newState }));
                    }),
                    catchError((error) => of(loadYearlyMonitorDataFailure({ error })))
                )
            }
            )
        )
    );

}



