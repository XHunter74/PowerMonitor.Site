import { createReducer, on } from '@ngrx/store';
import { PowerFailureYearlyModel } from '../../models/power-failure-yearly.model';
import {
    loadYearlyFailuresData,
    loadYearlyFailuresDataSuccess,
    loadYearlyFailuresDataFailure,
} from '../actions/power-failures.yearly.actions';

export interface FailuresYearlyState {
    data: PowerFailureYearlyModel[];
    totalPowerFailure: number;
    failureAmount: number;
    loading: boolean;
    error: any;
}

const initialState: FailuresYearlyState = {
    data: [],
    totalPowerFailure: 0,
    failureAmount: 0,
    loading: false,
    error: null,
};

export const powerFailuresYearlyReducer = createReducer(
    initialState,
    on(loadYearlyFailuresData, (state) => ({ ...state, loading: true, error: null })),
    on(loadYearlyFailuresDataSuccess, (_state, { data }) => ({ ...data, loading: false })),
    on(loadYearlyFailuresDataFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
