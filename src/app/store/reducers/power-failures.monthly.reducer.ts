import { createReducer, on } from '@ngrx/store';
import { PowerFailureMonthlyModel } from '../../models/power-failure-monthly.model';
import {
    loadMonthlyFailuresData,
    loadMonthlyFailuresDataSuccess,
    loadMonthlyFailuresDataFailure,
} from '../actions/power-failures.monthly.actions';

export interface FailuresMonthlyState {
    data: PowerFailureMonthlyModel[];
    totalPowerFailure: number;
    failureAmount: number;
    date: Date | null;
    loading: boolean;
    error: any;
}

const initialState: FailuresMonthlyState = {
    data: [],
    totalPowerFailure: 0,
    failureAmount: 0,
    date: null,
    loading: false,
    error: null,
};

export const powerFailuresMonthlyReducer = createReducer(
    initialState,
    on(loadMonthlyFailuresData, (state) => ({ ...state, loading: true, error: null })),
    on(loadMonthlyFailuresDataSuccess, (_state, { data }) => ({ ...data, loading: false })),
    on(loadMonthlyFailuresDataFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
