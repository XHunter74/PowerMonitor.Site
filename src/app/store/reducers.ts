import { ActionReducerMap } from '@ngrx/store';
import { voltageAmperageReducer, VoltageAmperageState } from './reducers/voltage-amperage.reducer';
import { MonitorHourlyState, powerMonitorHourlyReducer } from './reducers/power-monitor.hourly.reducer';
import { MonitorDailyState, powerMonitorDailyReducer } from './reducers/power-monitor.daily.reducer';
import { MonitorMonthlyState, powerMonitorMonthlyReducer } from './reducers/power-monitor.monthly.reducer';
import { MonitorYearlyState, powerMonitorYearlyReducer } from './reducers/power-monitor.yearly.reducer';
import { FailuresHourlyState, powerFailuresHourlyReducer } from './reducers/power-failures.hourly.reducer';
import { FailuresDailyState, powerFailuresDailyReducer } from './reducers/power-failures.daily.reducer';
import { FailuresMonthlyState, powerFailuresMonthlyReducer } from './reducers/power-failures.monthly.reducer';
import { FailuresYearlyState, powerFailuresYearlyReducer } from './reducers/power-failures.yearly.reducer';
import { PowerConsumptionAddState, PowerConsumptionDeleteState, PowerConsumptionEditState, PowerConsumptionState, powerConsumptionAddReducer, powerConsumptionDeleteReducer, powerConsumptionEditReducer, powerConsumptionReducer } from './reducers/power-consumption.reducer';
import { platformInfoReducer, PlatformInfoState } from './reducers/platform-info.reducer';

export interface AppState {
  voltageAmperage: VoltageAmperageState;
  powerMonitorHourly: MonitorHourlyState
  powerMonitorDaily: MonitorDailyState;
  powerMonitorMonthly: MonitorMonthlyState;
  powerMonitorYearly: MonitorYearlyState;
  powerFailuresHourly: FailuresHourlyState;
  powerFailuresDaily: FailuresDailyState;
  powerFailuresMonthly: FailuresMonthlyState;
  powerFailuresYearly: FailuresYearlyState;
  powerConsumption: PowerConsumptionState;
  powerConsumptionDelete: PowerConsumptionDeleteState;
  powerConsumptionAdd: PowerConsumptionAddState;
  powerConsumptionEdit: PowerConsumptionEditState;
  platformInfo: PlatformInfoState;
}

export const reducers: ActionReducerMap<AppState> = {
  voltageAmperage: voltageAmperageReducer,
  powerMonitorHourly: powerMonitorHourlyReducer,
  powerMonitorDaily: powerMonitorDailyReducer,
  powerMonitorMonthly: powerMonitorMonthlyReducer,
  powerMonitorYearly: powerMonitorYearlyReducer,
  powerFailuresHourly: powerFailuresHourlyReducer,
  powerFailuresDaily: powerFailuresDailyReducer,
  powerFailuresMonthly: powerFailuresMonthlyReducer,
  powerFailuresYearly: powerFailuresYearlyReducer,
  powerConsumption: powerConsumptionReducer,
  powerConsumptionDelete: powerConsumptionDeleteReducer,
  powerConsumptionAdd: powerConsumptionAddReducer,
  powerConsumptionEdit: powerConsumptionEditReducer,
  platformInfo: platformInfoReducer,
};