import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { InfoService } from '../../services/info.service';
import {
    loadPlatformInfo,
    loadPlatformInfoSuccess,
    loadPlatformInfoFailure,
} from '../actions/platform-info.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

@Injectable()
export class PlatformInfoEffects {
    private actions$ = inject(Actions);

    constructor(private infoService: InfoService) {}

    loadPlatformInfo$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadPlatformInfo),
            switchMap(() =>
                combineLatest([
                    this.infoService.getSystemInfo(),
                    this.infoService.getBoardVersion(),
                ]).pipe(
                    map(([sysInfo, boardInfo]) => loadPlatformInfoSuccess({ sysInfo, boardInfo })),
                    catchError((error) => of(loadPlatformInfoFailure({ error }))),
                ),
            ),
            catchError((error) => {
                console.error('Unexpected error in loadPlatformInfo$:', error);
                return of(loadPlatformInfoFailure({ error }));
            }),
        ),
    );
}
