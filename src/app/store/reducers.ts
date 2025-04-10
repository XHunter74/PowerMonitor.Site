import { ActionReducerMap } from '@ngrx/store';
import { voltageAmperageReducer, VoltageAmperageState } from './reducers/voltage-amperage.reducer';
import { MonitorHourlyState, powerMonitorHourlyReducer } from './reducers/power-monitor.hourly.reducer';
import { MonitorDailyState, powerMonitorDailyReducer } from './reducers/power-monitor.daily.reducer';
import { MonitorMonthlyState, powerMonitorMonthlyReducer } from './reducers/power-monitor.monthly.reducer';

export interface AppState {
  voltageAmperage: VoltageAmperageState;
  powerMonitorHourly: MonitorHourlyState
  powerMonitorDaily: MonitorDailyState;
  powerMonitorMonthly: MonitorMonthlyState
}

export const reducers: ActionReducerMap<AppState> = {
  voltageAmperage: voltageAmperageReducer,
  powerMonitorHourly: powerMonitorHourlyReducer,
  powerMonitorDaily: powerMonitorDailyReducer,
  powerMonitorMonthly: powerMonitorMonthlyReducer
};