import { createAction, props } from '@ngrx/store';
import { PowerConsumptionDeleteState, PowerConsumptionState } from '../reducers/power-consumption.reducer';

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

export const deletePowerConsumptionData = createAction(
    '[Power Consumption] Delete Data',
    props<{ recordId: number }>()
);

export const deletePowerConsumptionDataSuccess = createAction(
    '[Power Consumption] Delete Data Success',
    props<{ data: PowerConsumptionDeleteState }>()
);

export const deletePowerConsumptionDataFailure = createAction(
    '[Power Consumption] Delete Data Failure',
    props<{ error: any }>()
);