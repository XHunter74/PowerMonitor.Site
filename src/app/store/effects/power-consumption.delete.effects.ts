import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PowerService } from '../../services/power-service';
import { catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
    deletePowerConsumptionData,
    deletePowerConsumptionDataFailure,
    deletePowerConsumptionDataSuccess,
    loadPowerConsumptionData,
    loadPowerConsumptionDataFailure,
    loadPowerConsumptionDataSuccess,
} from '../actions/power-consumption.actions';
import { PowerConsumptionDeleteState } from '../reducers/power-consumption.reducer';

@Injectable()
export class PowerConsumptionDeleteEffects {
    private actions$ = inject(Actions);

    constructor(private powerService: PowerService) {}

    deletePowerConsumptionData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deletePowerConsumptionData),
            mergeMap(({ recordId }) =>
                this.powerService.deletePowerMeteringRecord(recordId).pipe(
                    mergeMap(() => {
                        const newState = {
                            operationComplete: true,
                        } as PowerConsumptionDeleteState;

                        return of(deletePowerConsumptionDataSuccess({ data: newState }));
                    }),
                    catchError((error) => of(deletePowerConsumptionDataFailure({ error }))),
                ),
            ),
        ),
    );
}
