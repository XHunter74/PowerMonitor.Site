import { ActionReducerMap } from '@ngrx/store';
import { voltageAmperageReducer, VoltageAmperageState } from './reducers/voltage-amperage.reducer';
import { MonitorHourlyState, powerMonitorHourlyReducer } from './reducers/power-monitor.hourly.reducer';
import { MonitorDailyState, powerMonitorDailyReducer } from './reducers/power-monitor.daily.reducer';
import { MonitorMonthlyState, powerMonitorMonthlyReducer } from './reducers/power-monitor.monthly.reducer';
import { MonitorYearlyState, powerMonitorYearlyReducer } from './reducers/power-monitor.yearly.reducer';

export interface AppState {
  voltageAmperage: VoltageAmperageState;
  powerMonitorHourly: MonitorHourlyState
  powerMonitorDaily: MonitorDailyState;
  powerMonitorMonthly: MonitorMonthlyState;
  powerMonitorYearly: MonitorYearlyState;
}

export const reducers: ActionReducerMap<AppState> = {
  voltageAmperage: voltageAmperageReducer,
  powerMonitorHourly: powerMonitorHourlyReducer,
  powerMonitorDaily: powerMonitorDailyReducer,
  powerMonitorMonthly: powerMonitorMonthlyReducer,
  powerMonitorYearly: powerMonitorYearlyReducer
};