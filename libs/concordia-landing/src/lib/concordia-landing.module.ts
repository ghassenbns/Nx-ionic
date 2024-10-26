import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@concordia-nx-ionic/concordia-shared';
import { IonicModule } from '@ionic/angular';

import { LandingComponent } from './landing/landing.component';
import { ConcordiaLandingRoutingModule } from './lib.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IonicModule.forRoot(),
    ConcordiaLandingRoutingModule,
    SharedModule,
  ],
  declarations: [
    LandingComponent,
  ],
})
export class ConcordiaLandingModule {}
