import { ActionReducerMap } from '@ngrx/store';
import { voltageAmperageReducer, VoltageAmperageState } from './voltage-amperage.reducer';

export interface AppState {
  voltageAmperage: VoltageAmperageState;
}

export const reducers: ActionReducerMap<AppState> = {
  voltageAmperage: voltageAmperageReducer,
};