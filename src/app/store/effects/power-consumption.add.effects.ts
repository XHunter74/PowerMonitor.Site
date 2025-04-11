import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PowerService } from '../../services/power-service';
import { catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { addPowerConsumptionData, addPowerConsumptionDataFailure, addPowerConsumptionDataSuccess } from '../actions/power-consumption.actions';
import { PowerConsumptionAddState } from '../reducers/power-consumption.reducer';

@Injectable()
export class PowerConsumptionAddEffects {

    private actions$ = inject(Actions);

    constructor(private powerService: PowerService) { }

    addPowerConsumptionData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addPowerConsumptionData),
            mergeMap(({ newRecord }) =>
                this.powerService.addPowerMeteringRecord(newRecord).pipe(
                    mergeMap(() => {
                        const newState = {
                            operationComplete: true
                        } as PowerConsumptionAddState;

                        return of(addPowerConsumptionDataSuccess({ data: newState }));
                    }),
                    catchError((error) => of(addPowerConsumptionDataFailure({ error })))
                )
            )
        )
    );

}