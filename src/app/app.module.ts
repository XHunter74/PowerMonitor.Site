import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule, isDevMode } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts';
import { AppMaterialModule } from './material-module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LiveDataComponent } from './live-data/live-data.component';
import { LoginModalComponent } from './app-login/login-modal.component';
import { AppLoginComponent } from './app-login/login.component';
import { PowerMonitorComponent } from './power-monitor/power-monitor.component';
import { PowerMonitorHourlyComponent } from './power-monitor/power-monitor-hourly.component';
import { PowerMonitorDailyComponent } from './power-monitor/power-monitor-daily.component';
import { PowerMonitorMonthlyComponent } from './power-monitor/power-monitor-monthly.component';
import { PowerMonitorYearlyComponent } from './power-monitor/power-monitor-yearly.component';
import { VoltageAmperageComponent } from './voltage-amperage/voltage-amperage.component';
import { VoltageAmperageHourlyComponent } from './voltage-amperage/voltage-amperage-hourly.component';
import { APP_DATE_FORMATS } from './app-date-format';
import { PowerFailuresComponent } from './power-failures/power-failures.component';
import { SpinnerDialogComponent } from './spinner-dialog/spinner-dialog.component';
import { AppDateAdapter } from './app-date.adapter';
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
import { AppHttpInterceptor } from './interceptors/http.interceptor';
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
import { AuthGuard, OpenGuard } from './guards/auth.guard';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { VoltageAmperageEffects } from './store/effects/voltage-amperage.effects';
import { PowerMonitorHourlyEffects } from './store/effects/power-monitor.hourly.effects';
import { PowerMonitorDailyEffects } from './store/effects/power-monitor.daily.effects';
import { PowerMonitorMonthlyEffects } from './store/effects/power-monitor.monthly.effects';
import { PowerMonitorYearlyEffects } from './store/effects/power-monitor.yearly.effects';
import { PowerFailuresHourlyEffects } from './store/effects/power-failures.hourly.effects';
import { PowerFailuresDailyEffects } from './store/effects/power-failures.daily.effects';
import { PowerFailuresMonthlyEffects } from './store/effects/power-failures.monthly.effects';
import { PowerFailuresYearlyEffects } from './store/effects/power-failures.yearly.effects';
import { PowerConsumptionEffects } from './store/effects/power-consumption.effects';
import { PowerConsumptionDeleteEffects } from './store/effects/power-consumption.delete.effects';
import { PowerConsumptionAddEffects } from './store/effects/power-consumption.add.effects';
import { PowerConsumptionEditEffects } from './store/effects/power-consumption.edit.effects';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UpdateService } from './services/update.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LiveDataComponent,
    AppLoginComponent,
    LoginModalComponent,
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
    SpinnerDialogComponent,
    ErrorDialogComponent,
    PowerConsumptionComponent,
    QuestionDialogComponent,
    EditPowerConsumptionComponent,
    AutofocusDirective,
    ChangeLanguageDialogComponent,
    DecimalNumbersOnlyDirective
  ],
  imports: [
    BrowserModule,
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
    EffectsModule.forRoot([
      VoltageAmperageEffects, PowerMonitorHourlyEffects, PowerMonitorDailyEffects,
      PowerMonitorMonthlyEffects, PowerMonitorYearlyEffects, PowerFailuresHourlyEffects,
      PowerFailuresDailyEffects, PowerFailuresMonthlyEffects, PowerFailuresYearlyEffects,
      PowerConsumptionEffects, PowerConsumptionDeleteEffects, PowerConsumptionAddEffects,
      PowerConsumptionEditEffects]),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
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
    { provide: APP_INITIALIZER, useFactory: appInitializerFactory, deps: [TranslateService, Injector], multi: true },
    UpdateService,
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private updateService: UpdateService
  ) { }
}


