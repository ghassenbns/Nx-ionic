import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { effects } from './stores/effects';
import { featureName, reducers } from './stores/reducers';
import { states } from './stores/states';

@NgModule({
  imports: [
    CommonModule,

    // Ngrx Store Imports.
    StoreModule.forFeature(featureName, reducers),

    // Ngrx Effects Imports.
    EffectsModule.forFeature(effects),
  ],
  providers: [
    ...states,
  ],
})
export class ConcordiaEnergyStoreModule {}
