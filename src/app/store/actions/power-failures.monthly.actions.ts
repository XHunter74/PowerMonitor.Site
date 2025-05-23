import { createAction, props } from '@ngrx/store';
import { FailuresMonthlyState } from '../reducers/power-failures.monthly.reducer';

export const loadMonthlyFailuresData = createAction(
    '[Failures Monthly] Load Data',
    props<{ date: Date }>(),
);

export const loadMonthlyFailuresDataSuccess = createAction(
    '[Failures Monthly] Load Data Success',
    props<{ data: FailuresMonthlyState }>(),
);

export const loadMonthlyFailuresDataFailure = createAction(
    '[Failures Monthly] Load Data Failure',
    props<{ error: any }>(),
);
