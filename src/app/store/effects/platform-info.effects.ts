import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ServicesService } from '../../services/services-service';
import { loadPlatformInfo, loadPlatformInfoSuccess, loadPlatformInfoFailure } from '../actions/platform-info.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class PlatformInfoEffects {

    private actions$ = inject(Actions);

    constructor(private servicesService: ServicesService) {}

    loadPlatformInfo$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadPlatformInfo),
            mergeMap(() =>
                this.servicesService.getSystemInfo().pipe(
                    mergeMap((sysInfo) =>
                        this.servicesService.getBoardVersion().pipe(
                            map((boardInfo) => loadPlatformInfoSuccess({ sysInfo, boardInfo }))
                        )
                    ),
                    catchError((error) => of(loadPlatformInfoFailure({ error })))
                )
            )
        )
    );
}