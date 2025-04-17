import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoltageAmperageComponent } from './voltage-amperage/voltage-amperage.component';
import { AppLoginComponent } from './app-login/login.component';
import { PowerConsumptionComponent } from './power-consumption/power-consumption.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'power-monitor/hourly',
        pathMatch: 'full'
    },
    {
        path: 'online-data',
        canActivate: [AuthGuard],
        loadChildren: () => import('./live-data/live-data.module').then(m => m.LiveDataModule)
    },
    {
        path: 'platform-info',
        canActivate: [AuthGuard],
        loadChildren: () => import('./platform-info/platform-info.module').then(m => m.PlatformInfoModule)
    },
    {
        path: 'power-monitor',
        canActivate: [AuthGuard],
        loadChildren: () => import('./power-monitor/power-monitor.module').then(m => m.PowerMonitorModule)
    },
    {
        path: 'power-failures',
        canActivate: [AuthGuard],
        loadChildren: () => import('./power-failures/power-failures.module').then(m => m.PowerFailuresModule)
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
