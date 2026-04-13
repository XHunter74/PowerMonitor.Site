import { createAction, props } from '@ngrx/store';
import { ISystemInfo } from '../../models/sysinfo.model';

export const loadPlatformInfo = createAction('[Platform Info] Load Platform Info');

export const loadPlatformInfoSuccess = createAction(
    '[Platform Info] Load Platform Info Success',
    props<{ sysInfo: ISystemInfo }>(),
);

export const loadPlatformInfoFailure = createAction(
    '[Platform Info] Load Platform Info Failure',
    props<{ error: any }>(),
);
