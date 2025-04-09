import { createAction, props } from '@ngrx/store';
import { VoltageAmperageState } from '../reducers/voltage-amperage.reducer';

export const loadVoltageAmperage = createAction(
    '[Voltage Amperage] Load Data',
    props<{ date: Date }>()
);

export const loadVoltageAmperageSuccess = createAction(
    '[Voltage Amperage] Load Data Success',
    props<{ data: VoltageAmperageState }>()
);

export const loadVoltageAmperageFailure = createAction(
    '[Voltage Amperage] Load Data Failure',
    props<{ error: any }>()
);