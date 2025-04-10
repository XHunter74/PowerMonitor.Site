import { createAction, props } from '@ngrx/store';
import { FailuresYearlyState } from '../reducers/power-failures.yearly.reducer';

export const loadYearlyFailuresData = createAction(
    '[Failures Yearly] Load Data',
    props<{ data: any }>()
);

export const loadYearlyFailuresDataSuccess = createAction(
    '[Failures Yearly] Load Data Success',
    props<{ data: FailuresYearlyState }>()
);

export const loadYearlyFailuresDataFailure = createAction(
    '[Failures Yearly] Load Data Failure',
    props<{ error: any }>()
);