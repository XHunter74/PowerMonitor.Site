import { createAction, props } from '@ngrx/store';
import { MonitorYearlyState } from '../reducers/power-monitor.yearly.reducer';

export const loadYearlyMonitorData = createAction(
    '[Monitor Yearly] Load Data',
    props<{ data: any }>(),
);

export const loadYearlyMonitorDataSuccess = createAction(
    '[Monitor Yearly] Load Data Success',
    props<{ data: MonitorYearlyState }>(),
);

export const loadYearlyMonitorDataFailure = createAction(
    '[Monitor Yearly] Load Data Failure',
    props<{ error: any }>(),
);
