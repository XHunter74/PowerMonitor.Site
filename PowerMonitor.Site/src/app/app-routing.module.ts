import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PowerMonitorComponent } from './power-monitor/power-monitor.component';
import { OpenGuard, AuthGuard } from './services/auth.guard';
import { RealDataComponent } from './real-data/real-data.component';
import { PlatformInfoComponent } from './platform-info/platform-info.component';
import { SiteSettingsComponent } from './site-settings/site-settings.component';
import { PowerFailuresComponent } from './power-failures/power-failures.component';
import { VoltageAmperageComponent } from './voltage-amperage/voltage-amperage.component';
import { ProfileComponent } from './profile-component/profile.component';
import { AppLoginComponent } from './app-login/login.component';
import { ElectricityMeteringComponent } from './electricity-metering/electricity-metering.component';

const routes: Routes = [
    { path: '', component: PowerMonitorComponent, data: { name: 'hourly' }, canActivate: [OpenGuard] },
    { path: 'online-data', component: RealDataComponent, pathMatch: 'full', canActivate: [AuthGuard] },
    { path: 'platform-info', component: PlatformInfoComponent, canActivate: [OpenGuard] },
    { path: 'settings', component: SiteSettingsComponent, canActivate: [AuthGuard] },
    { path: 'power-monitor', component: PowerMonitorComponent, data: { name: 'hourly' }, canActivate: [OpenGuard] },
    { path: 'power-monitor/hourly', component: PowerMonitorComponent, data: { name: 'hourly' }, canActivate: [OpenGuard] },
    { path: 'power-monitor/daily', component: PowerMonitorComponent, data: { name: 'daily' }, canActivate: [OpenGuard] },
    { path: 'power-monitor/monthly', component: PowerMonitorComponent, data: { name: 'monthly' }, canActivate: [OpenGuard] },
    { path: 'power-failures', component: PowerFailuresComponent, canActivate: [OpenGuard] },
    { path: 'power-failures/daily', component: PowerFailuresComponent, data: { name: 'daily' }, canActivate: [OpenGuard] },
    { path: 'power-failures/monthly', component: PowerFailuresComponent, data: { name: 'monthly' }, canActivate: [OpenGuard] },
    { path: 'voltage-amperage/hourly', component: VoltageAmperageComponent, data: { name: 'hourly' }, canActivate: [OpenGuard] },
    { path: 'voltage-amperage/daily', component: VoltageAmperageComponent, data: { name: 'daily' }, canActivate: [OpenGuard] },
    { path: 'profile', component: ProfileComponent, pathMatch: 'full', canActivate: [AuthGuard] },
    { path: 'power-consumption', component: ElectricityMeteringComponent, canActivate: [AuthGuard] },
    { path: 'app-login', component: AppLoginComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
