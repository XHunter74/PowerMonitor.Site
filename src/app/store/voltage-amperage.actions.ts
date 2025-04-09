import { createAction, props } from '@ngrx/store';
import { IVoltageAmperageModel } from '../models/voltage-amperage.model';

export const loadVoltageAmperage = createAction(
    '[Voltage Amperage] Load Data',
    props<{ date: Date }>()
);

export const loadVoltageAmperageSuccess = createAction(
    '[Voltage Amperage] Load Data Success',
    props<{ data: IVoltageAmperageModel[], date: Date }>()
);

export const loadVoltageAmperageFailure = createAction(
    '[Voltage Amperage] Load Data Failure',
    props<{ error: any }>()
);