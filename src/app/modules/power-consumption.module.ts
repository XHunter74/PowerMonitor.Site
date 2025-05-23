import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { AppMaterialModule } from './material-module';
import { PowerConsumptionComponent } from '../components/power-consumption/power-consumption.component';
import { EditPowerConsumptionComponent } from '../components/power-consumption/edit-power-consumption.component';
import { PowerConsumptionEffects } from '../store/effects/power-consumption.effects';
import { PowerConsumptionDeleteEffects } from '../store/effects/power-consumption.delete.effects';
import { PowerConsumptionAddEffects } from '../store/effects/power-consumption.add.effects';
import { PowerConsumptionEditEffects } from '../store/effects/power-consumption.edit.effects';
import { DecimalNumbersOnlyDirective } from '../directives/decimal-numbers-only-directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutofocusDirective } from '../directives/autofocus.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path: '',
        component: PowerConsumptionComponent,
    },
];

@NgModule({
    declarations: [
        PowerConsumptionComponent,
        EditPowerConsumptionComponent,
        DecimalNumbersOnlyDirective,
        AutofocusDirective,
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        AppMaterialModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        EffectsModule.forFeature([
            PowerConsumptionEffects,
            PowerConsumptionDeleteEffects,
            PowerConsumptionAddEffects,
            PowerConsumptionEditEffects,
        ]),
    ],
})
export class PowerConsumptionModule {}
