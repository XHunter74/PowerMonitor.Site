import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLoginComponent } from '../components/app-login/login.component';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Constants } from '../constants';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'power-monitor/hourly',
        pathMatch: 'full',
    },
    {
        path: 'online-data',
        canActivate: [AuthGuard],
        loadChildren: () => import('./live-data.module').then((m) => m.LiveDataModule),
    },
    {
        path: 'platform-info',
        canActivate: [AuthGuard],
        loadChildren: () => import('./platform-info.module').then((m) => m.PlatformInfoModule),
    },
    {
        path: 'power-monitor',
        canActivate: [AuthGuard],
        loadChildren: () => import('./power-monitor.module').then((m) => m.PowerMonitorModule),
    },
    {
        path: 'power-failures',
        canActivate: [AuthGuard, RoleGuard],
        loadChildren: () => import('./power-failures.module').then((m) => m.PowerFailuresModule),
        data: { role: Constants.AdminRole },
    },
    {
        path: 'voltage-amperage/hourly',
        canActivate: [AuthGuard, RoleGuard],
        loadChildren: () =>
            import('./voltage-amperage.module').then((m) => m.VoltageAmperageModule),
        data: { role: Constants.AdminRole },
    },
    {
        path: 'power-consumption',
        canActivate: [AuthGuard, RoleGuard],
        loadChildren: () =>
            import('./power-consumption.module').then((m) => m.PowerConsumptionModule),
        data: { role: Constants.AdminRole },
    },
    { path: 'app-login', component: AppLoginComponent },
    { path: '**', component: AppLoginComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'ignore' })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
