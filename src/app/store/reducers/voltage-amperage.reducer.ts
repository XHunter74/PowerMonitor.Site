import { createReducer, on } from '@ngrx/store';
import { loadVoltageAmperage, loadVoltageAmperageSuccess, loadVoltageAmperageFailure } from '../actions/voltage-amperage.actions';
import { IVoltageAmperageModel } from '../../models/voltage-amperage.model';

export interface VoltageAmperageState {
    data: IVoltageAmperageModel[];
    maxVoltage: IVoltageAmperageModel | null;
    minVoltage: IVoltageAmperageModel | null;
    maxAmperage: IVoltageAmperageModel | null;
    minAmperage: IVoltageAmperageModel | null;
    date: Date | null;
    loading: boolean;
    error: any;
}

const initialState: VoltageAmperageState = {
    data: [],
    maxVoltage: null,
    minVoltage: null,
    maxAmperage: null,
    minAmperage: null,
    date: null,
    loading: false,
    error: null,
};

export const voltageAmperageReducer = createReducer(
    initialState,
    on(loadVoltageAmperage, (state) => ({ ...state, loading: true, error: null })),
    on(loadVoltageAmperageSuccess, (_state, { data }) => {
        const newState = { ...data };
        newState.loading = false;
        return newState;
    }),
    on(loadVoltageAmperageFailure, (state, { error }) => ({ ...state, loading: false, error }))
);