import { ActionReducerMap } from '@ngrx/store';
import { voltageAmperageReducer, VoltageAmperageState } from './reducers/voltage-amperage.reducer';
import { MonitorHourlyState, powerMonitorHourlyReducer } from './reducers/power-monitor.hourly.reducer';
import { MonitorDailyState, powerMonitorDailyReducer } from './reducers/power-monitor.daily.reducer';

export interface AppState {
  voltageAmperage: VoltageAmperageState;
  powerMonitorHourly: MonitorHourlyState
  powerMonitorDaily: MonitorDailyState;
}

export const reducers: ActionReducerMap<AppState> = {
  voltageAmperage: voltageAmperageReducer,
  powerMonitorHourly: powerMonitorHourlyReducer,
  powerMonitorDaily: powerMonitorDailyReducer,
};