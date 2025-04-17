import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlatformInfoComponent } from './platform-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { PlatformInfoEffects } from '../store/effects/platform-info.effects';

const routes: Routes = [
  { path: '', component: PlatformInfoComponent }
];

@NgModule({
  declarations: [PlatformInfoComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule.forChild(),
    EffectsModule.forFeature([PlatformInfoEffects])
  ],
})
export class PlatformInfoModule { }