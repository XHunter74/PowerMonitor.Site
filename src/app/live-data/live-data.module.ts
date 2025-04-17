import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { LiveDataComponent } from './live-data.component';
import { GoogleChartsModule } from 'angular-google-charts';

const routes: Routes = [
    {
        path: '',
        component: LiveDataComponent,
    }
];

@NgModule({
    declarations: [
        LiveDataComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        GoogleChartsModule,
        TranslateModule.forChild(),
    ],
})
export class LiveDataModule { }