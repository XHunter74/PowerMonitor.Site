import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PowerService } from '../services/power-service';
import { loadVoltageAmperage, loadVoltageAmperageSuccess, loadVoltageAmperageFailure } from './voltage-amperage.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class VoltageAmperageEffects {

    private actions$ = inject(Actions);

    constructor(private powerService: PowerService) { }

    loadVoltageAmperage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadVoltageAmperage),
            mergeMap(({ date }) =>
                this.powerService.getVoltageAmperageDataNew(date).pipe(
                    map((data) => loadVoltageAmperageSuccess({ data, date })),
                    catchError((error) => of(loadVoltageAmperageFailure({ error })))
                )
            )
        )
    );
}