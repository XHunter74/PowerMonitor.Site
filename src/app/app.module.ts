import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts';
import { AppMaterialModule } from './material-module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LiveDataComponent } from './live-data/live-data.component';
import { LoginModalComponent } from './app-login/login-modal.component';
import { AuthGuard, OpenGuard } from './services/auth.guard';
import { AppLoginComponent } from './app-login/login.component';
import { PlatformInfoComponent } from './platform-info/platform-info.component';
import { PowerMonitorComponent } from './power-monitor/power-monitor.component';
import { PowerMonitorHourlyComponent } from './power-monitor/power-monitor-hourly.component';
import { PowerMonitorDailyComponent } from './power-monitor/power-monitor-daily.component';
import { PowerMonitorMonthlyComponent } from './power-monitor/power-monitor-monthly.component';
import { PowerMonitorYearlyComponent } from './power-monitor/power-monitor-yearly.component';
import { VoltageAmperageComponent } from './voltage-amperage/voltage-amperage.component';
import { VoltageAmperageHourlyComponent } from './voltage-amperage/voltage-amperage-hourly.component';
import { APP_DATE_FORMATS } from './app-date-format';
import { PowerFailuresComponent } from './power-failures/power-failures.component';
import { SiteSettingsComponent } from './site-settings/site-settings.component';
import { SpinnerDialogComponent } from './spinner-dialog/spinner-dialog.component';
import { AppDateAdapter } from './app-date.adapter';
import { ProfileComponent } from './profile-component/profile.component';
import { SocketIoModule } from 'ngx-socket-io';
import { WebSocket, WebSocketService } from './services/websocket.service';
import { VoltageAmperageDailyComponent } from './voltage-amperage/voltage-amperage-daily.component';
import { ErrorDialogComponent } from './dialogs/error-dialog/error-dialog.component';
import { PowerFailuresHourlyComponent } from './power-failures/power-failures-hourly.component';
import { PowerFailuresDailyComponent } from './power-failures/power-failures-daily.component';
import { PowerFailuresMonthlyComponent } from './power-failures/power-failures-monthly.component';
import { PowerFailuresYearlyComponent } from './power-failures/power-failures-yearly.component';
import { AppRoutingModule } from './app-routing.module';
import { QuestionDialogComponent } from './dialogs/question-dialog/question-dialog.component';
import { ChangeLanguageDialogComponent } from './dialogs/change-language-dialog/change-language-dialog.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { AuthService } from './services/auth.service';
import { AppHttpInterceptor } from './services/http.interceptor';
import { UsersService } from './services/users-service';
import { PowerConsumptionComponent } from './power-consumption/power-consumption.component';
import { EditPowerConsumptionComponent } from './power-consumption/edit-power-consumption.component';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { GoogleChartsModule } from 'angular-google-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { appInitializerFactory, HttpLoaderFactory } from './app-initialize.factory';
import { environment } from '../environments/environment';
import { NgSelectModule } from '@ng-select/ng-select';
import { DecimalNumbersOnlyDirective } from './directives/decimal-numbers-only-directive';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { VoltageAmperageEffects } from './store/effects/voltage-amperage.effects';
import { PowerMonitorHourlyEffects } from './store/effects/power-monitor.hourly.effects';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LiveDataComponent,
    AppLoginComponent,
    LoginModalComponent,
    PlatformInfoComponent,
    PowerMonitorComponent,
    PowerMonitorHourlyComponent,
    PowerMonitorDailyComponent,
    PowerMonitorMonthlyComponent,
    PowerMonitorYearlyComponent,
    VoltageAmperageComponent,
    VoltageAmperageHourlyComponent,
    VoltageAmperageDailyComponent,
    PowerFailuresComponent,
    PowerFailuresHourlyComponent,
    PowerFailuresDailyComponent,
    PowerFailuresMonthlyComponent,
    PowerFailuresYearlyComponent,
    SiteSettingsComponent,
    SpinnerDialogComponent,
    ProfileComponent,
    ErrorDialogComponent,
    PowerConsumptionComponent,
    QuestionDialogComponent,
    EditPowerConsumptionComponent,
    AutofocusDirective,
    ChangeLanguageDialogComponent,
    DecimalNumbersOnlyDirective
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    NgChartsModule,
    AppMaterialModule,
    SocketIoModule,
    AppRoutingModule,
    GoogleChartsModule,
    TranslateModule.forRoot(
      {
        defaultLanguage: environment.defaultLocale,
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    ),
    NgSelectModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([VoltageAmperageEffects, PowerMonitorHourlyEffects]),
  ],
  providers: [
    AuthGuard,
    AuthService,
    UsersService,
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    OpenGuard,
    WebSocket,
    WebSocketService,
    { provide: DateAdapter, useClass: AppDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: APP_INITIALIZER, useFactory: appInitializerFactory, deps: [TranslateService, Injector], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


