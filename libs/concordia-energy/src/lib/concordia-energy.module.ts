import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConcordiaEnergyStoreModule } from '@concordia-nx-ionic/concordia-energy-store';
import { ConcordiaMapModule } from '@concordia-nx-ionic/concordia-map';
import { SharedModule } from '@concordia-nx-ionic/concordia-shared';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@ngneat/transloco';
import { Chart } from 'chart.js';
import { CrosshairPlugin } from 'chartjs-plugin-crosshair';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';

import { consumptionComparisonComponents } from './consumption-analysis';
import { HierarchyModule } from './hierarchy/hierarchy.module';
import { concordiaEnergyRoutes } from './lib.routes';
import { metersComponents } from './meters';

Chart.register(CrosshairPlugin);

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    RouterModule.forChild(concordiaEnergyRoutes),
    ConcordiaEnergyStoreModule,
    SharedModule,
    TranslocoModule,
    ConcordiaMapModule,
    IonicModule,
    FormsModule,
    TableModule,
    ChartModule,
    HierarchyModule,
  ],
  declarations: [
    ...metersComponents,
    ...consumptionComparisonComponents,
  ],
})
export class ConcordiaEnergyModule {}
