import { createAction, props } from '@ngrx/store';
import { MonitorMonthlyState } from '../reducers/power-monitor.monthly.reducer';

export const loadMonthlyMonitorData = createAction(
    '[Monitor Monthly] Load Data',
    props<{ date: Date }>()
);

export const loadMonthlyMonitorDataSuccess = createAction(
    '[Monitor Monthly] Load Data Success',
    props<{ data: MonitorMonthlyState }>()
);

export const loadMonthlyMonitorDataFailure = createAction(
    '[Monitor Monthly] Load Data Failure',
    props<{ error: any }>()
);