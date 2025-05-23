import { createReducer, on } from '@ngrx/store';
import { IPowerFailureModel } from '../../models/power-failure.model';
import {
    loadHourlyFailuresData,
    loadHourlyFailuresDataFailure,
    loadHourlyFailuresDataSuccess,
} from '../actions/power-failures.hourly.actions';

export interface FailuresHourlyState {
    data: IPowerFailureModel[];
    maxPowerFailure: IPowerFailureModel | null | undefined;
    totalPowerFailure: number;
    failureAmount: number;
    date: Date | null;
    loading: boolean;
    error: any;
}

const initialState: FailuresHourlyState = {
    data: [],
    maxPowerFailure: null,
    totalPowerFailure: 0,
    failureAmount: 0,
    date: null,
    loading: false,
    error: null,
};

export const powerFailuresHourlyReducer = createReducer(
    initialState,
    on(loadHourlyFailuresData, (state) => ({ ...state, loading: true, error: null })),
    on(loadHourlyFailuresDataSuccess, (_state, { data }) => ({ ...data, loading: false })),
    on(loadHourlyFailuresDataFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
