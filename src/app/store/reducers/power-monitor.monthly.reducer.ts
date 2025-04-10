import { createReducer, on } from '@ngrx/store';
import { IPowerDataMonthlyModel } from '../../models/power-data-monthly.model';
import { loadMonthlyMonitorData, loadMonthlyMonitorDataFailure, loadMonthlyMonitorDataSuccess } from '../actions/power-monitor.monthly.actions';

export interface MonitorMonthlyState {
    data: IPowerDataMonthlyModel[];
    powerSum: number;
    powerAvg: number;
    date: Date | null;
    loading: boolean;
    error: any;
}

const initialState: MonitorMonthlyState = {
    data: [],
    powerSum: 0,
    powerAvg: 0,
    date: null,
    loading: false,
    error: null,
};

export const powerMonitorMonthlyReducer = createReducer(
    initialState,
    on(loadMonthlyMonitorData, (state) => ({ ...state, loading: true, error: null })),
    on(loadMonthlyMonitorDataSuccess, (_state, { data }) => ({ ...data, loading: false })),
    on(loadMonthlyMonitorDataFailure, (state, { error }) => ({ ...state, loading: false, error }))
);