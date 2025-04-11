import { createReducer, on } from '@ngrx/store';
import { loadPowerConsumptionData, loadPowerConsumptionDataSuccess, loadPowerConsumptionDataFailure } from '../actions/power-consumption.actions';
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