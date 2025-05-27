import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PowerService } from '../../services/power.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
    loadPowerConsumptionData,
    loadPowerConsumptionDataFailure,
    loadPowerConsumptionDataSuccess,
} from '../actions/power-consumption.actions';
import { PowerConsumptionState } from '../reducers/power-consumption.reducer';
import { PowerMeteringDto } from '../../models/power-metering.dto';

@Injectable()
export class PowerConsumptionEffects {
    private actions$ = inject(Actions);

    constructor(private powerService: PowerService) {}

    loadPowerConsumptionData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadPowerConsumptionData),
            mergeMap(({}) =>
                this.powerService.getPowerConsumptionData().pipe(
                    mergeMap((data) => {
                        const newState = {} as PowerConsumptionState;
                        newState.data = data;
                        let minItem: PowerMeteringDto | undefined = undefined;
                        if (data.length > 0) {
                            minItem = data.reduce((prev, curr) => {
                                return prev.id < curr.id ? prev : curr;
                            });
                        }
                        newState.minItem = minItem;

                        return of(loadPowerConsumptionDataSuccess({ data: newState }));
                    }),
                    catchError((error) => of(loadPowerConsumptionDataFailure({ error }))),
                ),
            ),
        ),
    );
}
