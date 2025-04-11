import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PowerService } from '../../services/power-service';
import { catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { editPowerConsumptionData, editPowerConsumptionDataFailure, editPowerConsumptionDataSuccess } from '../actions/power-consumption.actions';
import { PowerConsumptionEditState } from '../reducers/power-consumption.reducer';

@Injectable()
export class PowerConsumptionEditEffects {

    private actions$ = inject(Actions);

    constructor(private powerService: PowerService) { }

    editPowerConsumptionData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(editPowerConsumptionData),
            mergeMap(({ id, newRecord }) =>
                this.powerService.editPowerMeteringRecord(id, newRecord).pipe(
                    mergeMap(() => {
                        const newState = {
                            operationComplete: true
                        } as PowerConsumptionEditState;

                        return of(editPowerConsumptionDataSuccess({ data: newState }));
                    }),
                    catchError((error) => of(editPowerConsumptionDataFailure({ error })))
                )
            )
        )
    );

}