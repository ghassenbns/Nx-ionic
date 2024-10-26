import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { clients } from './clients';

@NgModule({
  imports: [CommonModule],
  providers: [...clients],
})
export class ConcordiaEnergyApiModule {}
