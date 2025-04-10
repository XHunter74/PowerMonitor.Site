import { createReducer, on } from '@ngrx/store';
import { IPowerDataDailyModel } from '../../models/power-data-daily.model';
import { loadDailyMonitorData, loadDailyMonitorDataFailure, loadDailyMonitorDataSuccess } from '../actions/power-monitor.daily.actions';

export interface MonitorDailyState {
    data: IPowerDataDailyModel[];
    powerSum: number;
    powerAvg: number;
    forecast: number;
    date: Date | null;
    loading: boolean;
    error: any;
}

const initialState: MonitorDailyState = {
    data: [],
    powerSum: 0,
    powerAvg: 0,
    forecast: 0,
    date: null,
    loading: false,
    error: null,
};

export const powerMonitorDailyReducer = createReducer(
    initialState,
    on(loadDailyMonitorData, (state) => ({ ...state, loading: true, error: null })),
    on(loadDailyMonitorDataSuccess, (_state, { data }) => ({ ...data, loading: false })),
    on(loadDailyMonitorDataFailure, (state, { error }) => ({ ...state, loading: false, error }))
);