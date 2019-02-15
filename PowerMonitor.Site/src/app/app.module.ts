import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';

import { AppMaterialModule } from './material-module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { LoginModalComponent } from './app-login/login-modal.component';
import { AuthGuard } from './services/auth.guard';
import { AppLoginComponent } from './app-login/login.component';
import { PlatformInfoComponent } from './platform-info/platform-info.component';
import { PowerMonitorComponent } from './power-monitor/power-monitor.component';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    AppLoginComponent,
    LoginModalComponent,
    PlatformInfoComponent,
    PowerMonitorComponent
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
      { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'platform-info', component: PlatformInfoComponent, canActivate: [AuthGuard] },
      { path: 'power-monitor', component: PowerMonitorComponent, canActivate: [AuthGuard] },
      { path: 'app-login', component: AppLoginComponent },
    ])
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
