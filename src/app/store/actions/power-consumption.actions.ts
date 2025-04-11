import { createAction, props } from '@ngrx/store';
import { PowerConsumptionAddState, PowerConsumptionDeleteState, PowerConsumptionEditState, PowerConsumptionState } from '../reducers/power-consumption.reducer';
import { NewPowerMeteringDto } from '../../models/new-power-metering.dto';

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

export const addPowerConsumptionData = createAction(
    '[Power Consumption] Add Data',
    props<{ newRecord: NewPowerMeteringDto }>()
);

export const addPowerConsumptionDataSuccess = createAction(
    '[Power Consumption] Add Data Success',
    props<{ data: PowerConsumptionAddState }>()
);

export const addPowerConsumptionDataFailure = createAction(
    '[Power Consumption] Add Data Failure',
    props<{ error: any }>()
);

export const editPowerConsumptionData = createAction(
    '[Power Consumption] Edit Data',
    props<{ id:number, newRecord: NewPowerMeteringDto }>()
);

export const editPowerConsumptionDataSuccess = createAction(
    '[Power Consumption] Edit Data Success',
    props<{ data: PowerConsumptionEditState }>()
);

export const editPowerConsumptionDataFailure = createAction(
    '[Power Consumption] Edit Data Failure',
    props<{ error: any }>()
);