import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { AppMaterialModule } from '../material-module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VoltageAmperageEffects } from '../store/effects/voltage-amperage.effects';
import { VoltageAmperageHourlyComponent } from './voltage-amperage-hourly.component';

const routes: Routes = [
    {
        path: '',
        component: VoltageAmperageHourlyComponent,
    }
];

@NgModule({
    declarations: [
        VoltageAmperageHourlyComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        AppMaterialModule,
        NgbModule,
        TranslateModule.forChild(),
        EffectsModule.forFeature([VoltageAmperageEffects]),
    ],
})
export class VoltageAmperageModule { }