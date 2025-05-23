import { createAction, props } from '@ngrx/store';
import { FailuresDailyState } from '../reducers/power-failures.daily.reducer';

export const loadDailyFailuresData = createAction(
    '[Failures Daily] Load Data',
    props<{ date: Date }>(),
);

export const loadDailyFailuresDataSuccess = createAction(
    '[Failures Daily] Load Data Success',
    props<{ data: FailuresDailyState }>(),
);

export const loadDailyFailuresDataFailure = createAction(
    '[Failures Daily] Load Data Failure',
    props<{ error: any }>(),
);
