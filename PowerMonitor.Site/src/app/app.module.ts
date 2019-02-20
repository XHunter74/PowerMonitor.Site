import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';

import { AppMaterialModule } from './material-module';
import { GaugeChartComponent } from 'angular-gauge-chart';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { RealDataComponent } from './home/real-data.component';
import { LoginModalComponent } from './app-login/login-modal.component';
import { AuthGuard } from './services/auth.guard';
import { AppLoginComponent } from './app-login/login.component';
import { PlatformInfoComponent } from './platform-info/platform-info.component';
import { PowerMonitorComponent } from './power-monitor/power-monitor.component';
import { PowerMonitorHourlyComponent } from './power-monitor/power-monitor-hourly.component';
import { PowerMonitorDailyComponent } from './power-monitor/power-monitor-daily.component';
import { PowerMonitorMonthlyComponent } from './power-monitor/power-monitor-monthly.component';
import { VoltageAmperageComponent } from './voltage-amperage/voltage-amperage.component';
import { VoltageAmperageDailyComponent } from './voltage-amperage/voltage-amperage-daily.component';
import { VoltageAmperageMonthlyComponent } from './voltage-amperage/voltage-amperage-monthly.component';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { APP_DATE_FORMATS } from './app-date-format';


@NgModule({
  declarations: [
    GaugeChartComponent,
    AppComponent,
    NavMenuComponent,
    RealDataComponent,
    AppLoginComponent,
    LoginModalComponent,
    PlatformInfoComponent,
    PowerMonitorComponent,
    PowerMonitorHourlyComponent,
    PowerMonitorDailyComponent,
    PowerMonitorMonthlyComponent,
    VoltageAmperageComponent,
    VoltageAmperageDailyComponent,
    VoltageAmperageMonthlyComponent
  ],
  entryComponents: [LoginModalComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    ChartsModule,
    AppMaterialModule,
    RouterModule.forRoot([
      { path: '', component: RealDataComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'platform-info', component: PlatformInfoComponent, canActivate: [AuthGuard] },
      { path: 'power-monitor', component: PowerMonitorComponent, canActivate: [AuthGuard] },
      { path: 'power-monitor/hourly', component: PowerMonitorComponent, data: { name: 'hourly' }, canActivate: [AuthGuard] },
      { path: 'power-monitor/daily', component: PowerMonitorComponent, data: { name: 'daily' }, canActivate: [AuthGuard] },
      { path: 'power-monitor/monthly', component: PowerMonitorComponent, data: { name: 'monthly' }, canActivate: [AuthGuard] },
      { path: 'voltage-amperage', component: VoltageAmperageComponent, canActivate: [AuthGuard] },
      { path: 'app-login', component: AppLoginComponent },
    ])
  ],
  providers: [
    AuthGuard,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


