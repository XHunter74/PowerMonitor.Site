import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { PowerMonitorHourlyEffects } from '../store/effects/power-monitor.hourly.effects';
import { PowerMonitorDailyEffects } from '../store/effects/power-monitor.daily.effects';
import { PowerMonitorMonthlyEffects } from '../store/effects/power-monitor.monthly.effects';
import { PowerMonitorYearlyEffects } from '../store/effects/power-monitor.yearly.effects';
import { PowerMonitorComponent } from '../components/power-monitor/power-monitor.component';
import { PowerMonitorHourlyComponent } from '../components/power-monitor/power-monitor-hourly.component';
import { PowerMonitorDailyComponent } from '../components/power-monitor/power-monitor-daily.component';
import { PowerMonitorMonthlyComponent } from '../components/power-monitor/power-monitor-monthly.component';
import { PowerMonitorYearlyComponent } from '../components/power-monitor/power-monitor-yearly.component';
import { AppMaterialModule } from './material-module';
import { NgChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormatNumberPipe } from '../pipes/format-number.pipe';

const routes: Routes = [
    {
        path: '',
        component: PowerMonitorComponent,
        children: [
            { path: '', redirectTo: 'hourly', pathMatch: 'full' },
            { path: 'hourly', component: PowerMonitorHourlyComponent },
            { path: 'daily', component: PowerMonitorDailyComponent },
            { path: 'monthly', component: PowerMonitorMonthlyComponent },
            { path: 'yearly', component: PowerMonitorYearlyComponent },
        ],
    },
];

@NgModule({
    declarations: [
        PowerMonitorComponent,
        PowerMonitorHourlyComponent,
        PowerMonitorDailyComponent,
        PowerMonitorMonthlyComponent,
        PowerMonitorYearlyComponent,
        FormatNumberPipe,
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        AppMaterialModule,
        NgChartsModule,
        NgbModule,
        TranslateModule.forChild(),
        EffectsModule.forFeature([
            PowerMonitorHourlyEffects,
            PowerMonitorDailyEffects,
            PowerMonitorMonthlyEffects,
            PowerMonitorYearlyEffects,
        ]),
    ],
})
export class PowerMonitorModule {}
