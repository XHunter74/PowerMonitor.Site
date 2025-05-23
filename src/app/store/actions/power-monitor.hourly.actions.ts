import { createAction, props } from '@ngrx/store';
import { MonitorHourlyState } from '../reducers/power-monitor.hourly.reducer';

export const loadHourlyMonitorData = createAction(
    '[Monitor Hourly] Load Data',
    props<{ date: Date }>(),
);

export const loadHourlyMonitorDataSuccess = createAction(
    '[Monitor Hourly] Load Data Success',
    props<{ data: MonitorHourlyState }>(),
);

export const loadHourlyMonitorDataFailure = createAction(
    '[Monitor Hourly] Load Data Failure',
    props<{ error: any }>(),
);
