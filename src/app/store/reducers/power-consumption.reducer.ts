import { createReducer, on } from '@ngrx/store';
import { loadPowerConsumptionData, loadPowerConsumptionDataSuccess, loadPowerConsumptionDataFailure, deletePowerConsumptionData, deletePowerConsumptionDataSuccess, deletePowerConsumptionDataFailure } from '../actions/power-consumption.actions';
import { PowerMeteringDto } from '../../models/power-metering.dto';

export interface PowerConsumptionState {
    data: PowerMeteringDto[];
    minItem: PowerMeteringDto | null;
    loading: boolean;
    error: any;
}

const initialState: PowerConsumptionState = {
    data: [],
    minItem: null,
    loading: false,
    error: null,
};

export const powerConsumptionReducer = createReducer(
    initialState,
    on(loadPowerConsumptionData, (state) => ({ ...state, loading: true, error: null })),
    on(loadPowerConsumptionDataSuccess, (_state, { data }) => ({ ...data, loading: false })),
    on(loadPowerConsumptionDataFailure, (state, { error }) => ({ ...state, loading: false, error }))
);

export interface PowerConsumptionDeleteState {
    loading: boolean;
    error: any;
}

const initialDeleteState: PowerConsumptionDeleteState = {
    loading: false,
    error: null,
};

export const powerConsumptionDeleteReducer = createReducer(
    initialDeleteState,
    on(deletePowerConsumptionData, (state) => ({ ...state, loading: true, error: null })),
    on(deletePowerConsumptionDataSuccess, (_state, { data }) => ({ ...data, loading: false })),
    on(deletePowerConsumptionDataFailure, (state, { error }) => ({ ...state, loading: false, error }))
);