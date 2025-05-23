import { createReducer, on } from '@ngrx/store';
import {
    loadYearlyMonitorData,
    loadYearlyMonitorDataFailure,
    loadYearlyMonitorDataSuccess,
} from '../actions/power-monitor.yearly.actions';
import { IPowerDataYearlyModel } from '../../models/power-data-yearly.model';

export interface MonitorYearlyState {
    data: IPowerDataYearlyModel[];
    loading: boolean;
    error: any;
}

const initialState: MonitorYearlyState = {
    data: [],
    loading: true,
    error: null,
};

export const powerMonitorYearlyReducer = createReducer(
    initialState,
    on(loadYearlyMonitorData, (state) => ({ ...state, loading: true, error: null })),
    on(loadYearlyMonitorDataSuccess, (_state, { data }) => ({ ...data, loading: false })),
    on(loadYearlyMonitorDataFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
