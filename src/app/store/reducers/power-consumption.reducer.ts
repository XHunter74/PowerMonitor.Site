import { createReducer, on } from '@ngrx/store';
import { loadPowerConsumptionData, loadPowerConsumptionDataSuccess, loadPowerConsumptionDataFailure, deletePowerConsumptionData, deletePowerConsumptionDataSuccess, deletePowerConsumptionDataFailure, addPowerConsumptionData, addPowerConsumptionDataFailure, addPowerConsumptionDataSuccess, editPowerConsumptionData, editPowerConsumptionDataFailure, editPowerConsumptionDataSuccess } from '../actions/power-consumption.actions';
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
    operationComplete: boolean;
}

const initialDeleteState: PowerConsumptionDeleteState = {
    loading: false,
    error: null,
    operationComplete: false
};

export const powerConsumptionDeleteReducer = createReducer(
    initialDeleteState,
    on(deletePowerConsumptionData, (state) => ({ ...state, loading: true, error: null, operationComplete: false })),
    on(deletePowerConsumptionDataSuccess, (_state, { data }) => ({ ...data, loading: false, operationComplete: true })),
    on(deletePowerConsumptionDataFailure, (state, { error }) => ({ ...state, loading: false, error, operationComplete: false }))
);

export interface PowerConsumptionAddState {
    loading: boolean;
    error: any;
    operationComplete: boolean;
}

const initialAddState: PowerConsumptionAddState = {
    loading: false,
    error: null,
    operationComplete: false
};

export const powerConsumptionAddReducer = createReducer(
    initialAddState,
    on(addPowerConsumptionData, (state) => ({ ...state, loading: true, error: null, operationComplete: false })),
    on(addPowerConsumptionDataSuccess, (_state, { data }) => ({ ...data, loading: false, operationComplete: true })),
    on(addPowerConsumptionDataFailure, (state, { error }) => ({ ...state, loading: false, error, operationComplete: false }))
);

export interface PowerConsumptionEditState {
    loading: boolean;
    error: any;
    operationComplete: boolean;
}

const initialEditState: PowerConsumptionEditState = {
    loading: false,
    error: null,
    operationComplete: false
};

export const powerConsumptionEditReducer = createReducer(
    initialEditState,
    on(editPowerConsumptionData, (state) => ({ ...state, loading: true, error: null, operationComplete: false })),
    on(editPowerConsumptionDataSuccess, (_state, { data }) => ({ ...data, loading: false, operationComplete: true })),
    on(editPowerConsumptionDataFailure, (state, { error }) => ({ ...state, loading: false, error, operationComplete: false }))
);