import { createReducer, on } from '@ngrx/store';
import { loadHourlyMonitorData, loadHourlyMonitorDataFailure, loadHourlyMonitorDataSuccess } from '../actions/power-monitor.hourly.actions';
import { IPowerDataHourlyModel } from '../../models/power-data-hourly.model';

export interface MonitorHourlyState {
    data: IPowerDataHourlyModel[];
    powerSum: number;
    powerAvg: number;
    forecast: number;
    date: Date | null;
    loading: boolean;
    error: any;
}

const initialState: MonitorHourlyState = {
    data: [],
    powerSum: 0,
    powerAvg: 0,
    forecast: 0,
    date: null,
    loading: false,
    error: null,
};

export const powerMonitorHourlyReducer = createReducer(
    initialState,
    on(loadHourlyMonitorData, (state) => ({ ...state, loading: true, error: null })),
    on(loadHourlyMonitorDataSuccess, (_state, { data }) => ({ ...data, loading: false })),
    on(loadHourlyMonitorDataFailure, (state, { error }) => ({ ...state, loading: false, error }))
);