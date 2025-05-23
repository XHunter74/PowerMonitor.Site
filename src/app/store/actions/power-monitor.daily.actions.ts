import { createAction, props } from '@ngrx/store';
import { MonitorDailyState } from '../reducers/power-monitor.daily.reducer';

export const loadDailyMonitorData = createAction(
    '[Monitor Daily] Load Data',
    props<{ date: Date }>(),
);

export const loadDailyMonitorDataSuccess = createAction(
    '[Monitor Daily] Load Data Success',
    props<{ data: MonitorDailyState }>(),
);

export const loadDailyMonitorDataFailure = createAction(
    '[Monitor Daily] Load Data Failure',
    props<{ error: any }>(),
);
