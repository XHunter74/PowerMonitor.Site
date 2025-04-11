import { createAction, props } from '@ngrx/store';
import { PowerConsumptionState } from '../reducers/power-consumption.reducer';

export const loadPowerConsumptionData = createAction(
    '[Power Consumption] Load Data',
    props<{ data: any }>()
);

export const loadPowerConsumptionDataSuccess = createAction(
    '[Power Consumption] Load Data Success',
    props<{ data: PowerConsumptionState }>()
);

export const loadPowerConsumptionDataFailure = createAction(
    '[Power Consumption] Load Data Failure',
    props<{ error: any }>()
);