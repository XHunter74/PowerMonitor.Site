import { createReducer, on } from '@ngrx/store';
import { loadVoltageAmperage, loadVoltageAmperageSuccess, loadVoltageAmperageFailure } from './voltage-amperage.actions';
import { IVoltageAmperageModel } from '../models/voltage-amperage.model';

export interface VoltageAmperageState {
    data: IVoltageAmperageModel[];
    date: Date | null;
    loading: boolean;
    error: any;
}

const initialState: VoltageAmperageState = {
    data: [],
    date: null,
    loading: false,
    error: null,
};

export const voltageAmperageReducer = createReducer(
    initialState,
    on(loadVoltageAmperage, (state) => ({ ...state, loading: true, error: null })),
    on(loadVoltageAmperageSuccess, (state, { data, date }) => ({ ...state, loading: false, data, date })),
    on(loadVoltageAmperageFailure, (state, { error }) => ({ ...state, loading: false, error }))
);