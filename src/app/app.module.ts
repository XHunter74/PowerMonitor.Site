import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule, isDevMode } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './material-module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LoginModalComponent } from './app-login/login-modal.component';
import { AppLoginComponent } from './app-login/login.component';
import { APP_DATE_FORMATS } from './app-date-format';
import { SpinnerDialogComponent } from './spinner-dialog/spinner-dialog.component';
import { AppDateAdapter } from './app-date.adapter';
import { ErrorDialogComponent } from './dialogs/error-dialog/error-dialog.component';
import { AppRoutingModule } from './app-routing.module';
import { QuestionDialogComponent } from './dialogs/question-dialog/question-dialog.component';
import { ChangeLanguageDialogComponent } from './dialogs/change-language-dialog/change-language-dialog.component';
import { AuthService } from './services/auth.service';
import { AppHttpInterceptor } from './interceptors/http.interceptor';
import { UsersService } from './services/users-service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { appInitializerFactory, HttpLoaderFactory } from './app-initialize.factory';
import { environment } from '../environments/environment';
import { NgSelectModule } from '@ng-select/ng-select';
import { AuthGuard, OpenGuard } from './guards/auth.guard';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UpdateService } from './services/update.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    AppLoginComponent,
    LoginModalComponent,
    SpinnerDialogComponent,
    ErrorDialogComponent,
    QuestionDialogComponent,
    ChangeLanguageDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
    EffectsModule.forRoot(),
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


