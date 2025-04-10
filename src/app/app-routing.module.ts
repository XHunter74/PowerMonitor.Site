import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PowerMonitorComponent } from './power-monitor/power-monitor.component';
import { AuthGuard } from './services/auth.guard';
import { LiveDataComponent } from './live-data/live-data.component';
import { PlatformInfoComponent } from './platform-info/platform-info.component';
import { SiteSettingsComponent } from './site-settings/site-settings.component';
import { PowerFailuresComponent } from './power-failures/power-failures.component';
import { VoltageAmperageComponent } from './voltage-amperage/voltage-amperage.component';
import { ProfileComponent } from './profile-component/profile.component';
import { AppLoginComponent } from './app-login/login.component';
import { PowerConsumptionComponent } from './power-consumption/power-consumption.component';
import { PowerMonitorHourlyComponent } from './power-monitor/power-monitor-hourly.component';
import { PowerMonitorDailyComponent } from './power-monitor/power-monitor-daily.component';
import { PowerMonitorMonthlyComponent } from './power-monitor/power-monitor-monthly.component';
import { PowerMonitorYearlyComponent } from './power-monitor/power-monitor-yearly.component';

const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'power-monitor/hourly',
        pathMatch: 'full'
    },
    { path: 'online-data', component: LiveDataComponent, pathMatch: 'full', canActivate: [AuthGuard] },
    { path: 'platform-info', component: PlatformInfoComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: SiteSettingsComponent, canActivate: [AuthGuard] },
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
    { path: 'power-failures', component: PowerFailuresComponent, canActivate: [AuthGuard] },
    { path: 'power-failures/hourly', component: PowerFailuresComponent, data: { name: 'hourly' }, canActivate: [AuthGuard] },
    { path: 'power-failures/daily', component: PowerFailuresComponent, data: { name: 'daily' }, canActivate: [AuthGuard] },
    { path: 'power-failures/monthly', component: PowerFailuresComponent, data: { name: 'monthly' }, canActivate: [AuthGuard] },
    { path: 'power-failures/yearly', component: PowerFailuresComponent, data: { name: 'yearly' }, canActivate: [AuthGuard] },
    { path: 'voltage-amperage/hourly', component: VoltageAmperageComponent, data: { name: 'hourly' }, canActivate: [AuthGuard] },
    { path: 'voltage-amperage/daily', component: VoltageAmperageComponent, data: { name: 'daily' }, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, pathMatch: 'full', canActivate: [AuthGuard] },
    { path: 'power-consumption', component: PowerConsumptionComponent, canActivate: [AuthGuard] },
    { path: 'app-login', component: AppLoginComponent },
    { path: '**', component: AppLoginComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'ignore' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
