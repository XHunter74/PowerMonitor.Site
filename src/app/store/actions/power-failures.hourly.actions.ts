import { createAction, props } from '@ngrx/store';
import { FailuresHourlyState } from '../reducers/power-failures.hourly.reducer';

export const loadHourlyFailuresData = createAction(
    '[Failures Hourly] Load Data',
    props<{ date: Date }>(),
);

export const loadHourlyFailuresDataSuccess = createAction(
    '[Failures Hourly] Load Data Success',
    props<{ data: FailuresHourlyState }>(),
);

export const loadHourlyFailuresDataFailure = createAction(
    '[Failures Hourly] Load Data Failure',
    props<{ error: any }>(),
);
