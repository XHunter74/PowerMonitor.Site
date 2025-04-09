import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PowerService } from '../../services/power-service';
import { loadVoltageAmperage, loadVoltageAmperageSuccess, loadVoltageAmperageFailure } from '../actions/voltage-amperage.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { VoltageAmperageState } from '../reducers/voltage-amperage.reducer';

@Injectable()
export class VoltageAmperageEffects {

    private actions$ = inject(Actions);

    constructor(private powerService: PowerService) { }

    loadVoltageAmperage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadVoltageAmperage),
            mergeMap(({ date }) =>
                this.powerService.getVoltageAmperageDataNew(date).pipe(
                    map((data) => {
                        const newState = {} as VoltageAmperageState;
                        newState.data = data;
                        newState.date = date;
                        newState.maxVoltage =
                            data.find(o => o.voltageMax === Math.max(...data.map(e => e.voltageMax)));
                        newState.minVoltage =
                            data.find(o => o.voltageMin === Math.min(...data.map(e => e.voltageMin)));
                        newState.maxAmperage =
                            data.find(o => o.amperageMax === Math.max(...data.map(e => e.amperageMax)));
                        newState.minAmperage =
                            data.find(o => o.amperageMin === Math.min(...data.map(e => e.amperageMin)));
                        return loadVoltageAmperageSuccess({ data: newState })
                    }),
                    catchError((error) => of(loadVoltageAmperageFailure({ error })))
                )
            )
        )
    );
}