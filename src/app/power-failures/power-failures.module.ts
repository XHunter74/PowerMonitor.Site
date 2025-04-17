import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { PowerMonitorHourlyEffects } from '../store/effects/power-monitor.hourly.effects';
import { PowerMonitorDailyEffects } from '../store/effects/power-monitor.daily.effects';
import { PowerMonitorMonthlyEffects } from '../store/effects/power-monitor.monthly.effects';
import { PowerMonitorYearlyEffects } from '../store/effects/power-monitor.yearly.effects';
import { AppMaterialModule } from '../material-module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {PowerFailuresComponent} from './power-failures.component';
import { PowerFailuresHourlyComponent } from './power-failures-hourly.component';
import { PowerFailuresDailyComponent } from './power-failures-daily.component';
import { PowerFailuresMonthlyComponent } from './power-failures-monthly.component';
import { PowerFailuresYearlyComponent } from './power-failures-yearly.component';
import {PowerFailuresHourlyEffects} from '../store/effects/power-failures.hourly.effects';
import { PowerFailuresDailyEffects } from '../store/effects/power-failures.daily.effects';
import { PowerFailuresMonthlyEffects } from '../store/effects/power-failures.monthly.effects';
import { PowerFailuresYearlyEffects } from '../store/effects/power-failures.yearly.effects';

const routes: Routes = [
  {
    path: '',
    component: PowerFailuresComponent,
    children: [
      { path: '', redirectTo: 'hourly', pathMatch: 'full' },
      { path: 'hourly', component: PowerFailuresHourlyComponent },
      { path: 'daily', component: PowerFailuresDailyComponent },
      { path: 'monthly', component: PowerFailuresMonthlyComponent },
      { path: 'yearly', component: PowerFailuresYearlyComponent }
    ]
  }
];

@NgModule({
  declarations: [
    PowerFailuresComponent,
    PowerFailuresHourlyComponent,
    PowerFailuresDailyComponent,
    PowerFailuresMonthlyComponent,
    PowerFailuresYearlyComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    AppMaterialModule,
    NgbModule,
    TranslateModule.forChild(),
    EffectsModule.forFeature([PowerFailuresHourlyEffects, PowerFailuresDailyEffects,
      PowerFailuresMonthlyEffects, PowerFailuresYearlyEffects])
  ],
})
export class PowerFailuresModule { }