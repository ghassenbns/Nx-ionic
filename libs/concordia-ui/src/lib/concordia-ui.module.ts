import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { services } from '../lib/services';
import { effects } from './stores/effects';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature(effects),
  ],
  providers: [...services],
})
export class ConcordiaUiModule {}
