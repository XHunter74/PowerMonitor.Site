import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PowerMonitorComponent } from './power-monitor/power-monitor.component';
import { LiveDataComponent } from './live-data/live-data.component';
import { PlatformInfoComponent } from './platform-info/platform-info.component';
import { PowerFailuresComponent } from './power-failures/power-failures.component';
import { VoltageAmperageComponent } from './voltage-amperage/voltage-amperage.component';
import { AppLoginComponent } from './app-login/login.component';
import { PowerConsumptionComponent } from './power-consumption/power-consumption.component';
import { PowerMonitorHourlyComponent } from './power-monitor/power-monitor-hourly.component';
import { PowerMonitorDailyComponent } from './power-monitor/power-monitor-daily.component';
import { PowerMonitorMonthlyComponent } from './power-monitor/power-monitor-monthly.component';
import { PowerMonitorYearlyComponent } from './power-monitor/power-monitor-yearly.component';
import { PowerFailuresDailyComponent } from './power-failures/power-failures-daily.component';
import { PowerFailuresHourlyComponent } from './power-failures/power-failures-hourly.component';
import { PowerFailuresMonthlyComponent } from './power-failures/power-failures-monthly.component';
import { PowerFailuresYearlyComponent } from './power-failures/power-failures-yearly.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'power-monitor/hourly',
        pathMatch: 'full'
    },
    { path: 'online-data', component: LiveDataComponent, pathMatch: 'full', canActivate: [AuthGuard] },
    {
        path: 'platform-info',
        canActivate: [AuthGuard],
        loadChildren: () => import('./platform-info/platform-info.module').then(m => m.PlatformInfoModule)
    },
    { 
        path: 'power-monitor', 
        component: PowerMonitorComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'hourly', pathMatch: 'full' },
            { path: 'hourly', component: PowerMonitorHourlyComponent },
            { path: 'daily', component: PowerMonitorDailyComponent },
            { path: 'monthly', component: PowerMonitorMonthlyComponent },
            { path: 'yearly', component: PowerMonitorYearlyComponent }
        ]
    },
    {
        path: 'power-failures', 
        component: PowerFailuresComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'hourly', pathMatch: 'full' },
            { path: 'hourly', component: PowerFailuresHourlyComponent },
            { path: 'daily', component: PowerFailuresDailyComponent },
            { path: 'monthly', component: PowerFailuresMonthlyComponent },
            { path: 'yearly', component: PowerFailuresYearlyComponent }
        ]
    },
    { path: 'voltage-amperage/hourly', component: VoltageAmperageComponent, data: { name: 'hourly' }, canActivate: [AuthGuard] },
    { path: 'voltage-amperage/daily', component: VoltageAmperageComponent, data: { name: 'daily' }, canActivate: [AuthGuard] },
    { path: 'power-consumption', component: PowerConsumptionComponent, canActivate: [AuthGuard] },
    { path: 'app-login', component: AppLoginComponent },
    { path: '**', component: AppLoginComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'ignore' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
