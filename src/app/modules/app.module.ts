import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule, isDevMode } from '@angular/core';
import {
    HTTP_INTERCEPTORS,
    HttpClient,
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './material.module';
import { AppComponent } from '../app.component';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { LoginModalComponent } from '../components/app-login/login-modal.component';
import { AppLoginComponent } from '../components/app-login/login.component';
import { APP_DATE_FORMATS } from '../adapters/app-date-format';
import { SpinnerDialogComponent } from '../dialogs/spinner-dialog/spinner-dialog.component';
import { AppDateAdapter } from '../adapters/app-date.adapter';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { AppRoutingModule } from './app-routing.module';
import { QuestionDialogComponent } from '../dialogs/question-dialog/question-dialog.component';
import { ChangeLanguageDialogComponent } from '../dialogs/change-language-dialog/change-language-dialog.component';
import { AuthService } from '../services/auth.service';
import { AppHttpInterceptor } from '../interceptors/http.interceptor';
import { UsersService } from '../services/users.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { appInitializerFactory, HttpLoaderFactory } from './app-initialize.factory';
import { environment } from '../../environments/environment';
import { AuthGuard, OpenGuard } from '../guards/auth.guard';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UpdateService } from '../services/update.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import 'moment/locale/uk';
import { RoleGuard } from '../guards/role.guard';

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
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        NgbModule,
        BrowserAnimationsModule,
        AppMaterialModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
            defaultLanguage: environment.defaultLocale,
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot(),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
    providers: [
        AuthGuard,
        RoleGuard,
        AuthService,
        UsersService,
        { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
        OpenGuard,
        { provide: DateAdapter, useClass: AppDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [TranslateService, Injector],
            multi: true,
        },
        UpdateService,
        provideHttpClient(withInterceptorsFromDi()),
    ],
})
export class AppModule {
    constructor(private updateService: UpdateService) {}
}
