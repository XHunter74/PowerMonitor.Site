import { createReducer, on } from '@ngrx/store';
import { IPowerFailureModel } from '../../models/power-failure.model';
import { loadDailyFailuresData, loadDailyFailuresDataFailure, loadDailyFailuresDataSuccess } from '../actions/power-failures.daily.actions';
import { PowerFailureDailyModel } from '../../models/power-failure-daily.model';

export interface FailuresDailyState {
    data: PowerFailureDailyModel[];
    maxPowerFailure: IPowerFailureModel | null | undefined;
    totalPowerFailure: number;
    failureAmount: number;
    date: Date | null;
    loading: boolean;
    error: any;
}

const initialState: FailuresDailyState = {
    data: [],
    maxPowerFailure: null,
    totalPowerFailure: 0,
    failureAmount: 0,
    date: null,
    loading: false,
    error: null,
};

export const powerFailuresDailyReducer = createReducer(
    initialState,
    on(loadDailyFailuresData, (state) => ({ ...state, loading: true, error: null })),
    on(loadDailyFailuresDataSuccess, (_state, { data }) => ({ ...data, loading: false })),
    on(loadDailyFailuresDataFailure, (state, { error }) => ({ ...state, loading: false, error }))
);