import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';

import { AppMaterialModule } from './material-module';
import { GaugeChartModule } from 'angular-gauge-chart';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { RealDataComponent } from './real-data/real-data.component';
import { LoginModalComponent } from './app-login/login-modal.component';
import { AuthGuard, OpenGuard } from './services/auth.guard';
import { AppLoginComponent } from './app-login/login.component';
import { PlatformInfoComponent } from './platform-info/platform-info.component';
import { PowerMonitorComponent } from './power-monitor/power-monitor.component';
import { PowerMonitorHourlyComponent } from './power-monitor/power-monitor-hourly.component';
import { PowerMonitorDailyComponent } from './power-monitor/power-monitor-daily.component';
import { PowerMonitorMonthlyComponent } from './power-monitor/power-monitor-monthly.component';
import { VoltageAmperageComponent } from './voltage-amperage/voltage-amperage.component';
import { VoltageAmperageHourlyComponent } from './voltage-amperage/voltage-amperage-hourly.component';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { APP_DATE_FORMATS } from './app-date-format';
import { PowerFailuresComponent } from './power-failures/power-failures.component';
import { BoardSettingsComponent } from './board-settings/board-settings.component';
import { SpinnerDialogComponent } from './spinner-dialog/spinner-dialog.component';
import { AppDateAdapter } from './app-date.adapter';
import { HomeComponent } from './home-component/home.component';
import { ProfileComponent } from './profile-component/profile.component';
import { SocketIoModule } from 'ng-socket-io';
import { WebSocket, WebSocketService } from './services/websocket.service';


@NgModule({
  declarations: [
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
    VoltageAmperageHourlyComponent,
    PowerFailuresComponent,
    BoardSettingsComponent,
    SpinnerDialogComponent,
    HomeComponent,
    ProfileComponent
  ],
  entryComponents: [LoginModalComponent, SpinnerDialogComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    ChartsModule,
    AppMaterialModule,
    GaugeChartModule,
    SocketIoModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [OpenGuard] },
      { path: 'online-data', component: RealDataComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'platform-info', component: PlatformInfoComponent, canActivate: [OpenGuard] },
      { path: 'settings', component: BoardSettingsComponent, canActivate: [AuthGuard] },
      { path: 'power-monitor/hourly', component: PowerMonitorComponent, data: { name: 'hourly' }, canActivate: [OpenGuard] },
      { path: 'power-monitor/daily', component: PowerMonitorComponent, data: { name: 'daily' }, canActivate: [OpenGuard] },
      { path: 'power-monitor/monthly', component: PowerMonitorComponent, data: { name: 'monthly' }, canActivate: [OpenGuard] },
      { path: 'power-failures', component: PowerFailuresComponent, canActivate: [OpenGuard] },
      { path: 'voltage-amperage/hourly', component: VoltageAmperageComponent, data: { name: 'hourly' }, canActivate: [OpenGuard] },
      { path: 'profile', component: ProfileComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'app-login', component: AppLoginComponent },
    ])
  ],
  providers: [
    AuthGuard,
    OpenGuard,
    WebSocket,
    WebSocketService,
    { provide: DateAdapter, useClass: AppDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


