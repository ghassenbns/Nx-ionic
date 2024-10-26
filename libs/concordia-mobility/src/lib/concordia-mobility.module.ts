import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  ConcordiaMapModule,
  ConcordiaTripsMapModule,
} from '@concordia-nx-ionic/concordia-map';
import { ConcordiaMobilityStoreModule } from '@concordia-nx-ionic/concordia-mobility-store';
import { SharedModule } from '@concordia-nx-ionic/concordia-shared';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@ngneat/transloco';
import { Chart } from 'chart.js';
import { CrosshairPlugin } from 'chartjs-plugin-crosshair';
import { ChartModule } from 'primeng/chart';

import { driversComponents } from './drivers';
import { fleetsComponents } from './fleets';
import { ConcordiaMobilityRoutingModule } from './lib.routes';
import { sharedComponents } from './shared';
import { tripsComponents } from './trips';
import { ChartCardComponent } from './trips/components/chart-card/chart-card.component';
import { TimeSeriesChartComponent } from './trips/components/time-series-chart/time-series-chart.component';
import { VehicleTrajectoryComponent } from './trips/components/vehicle-trajectory/vehicle-trajectory.component';
import { vehiclesComponents } from './vehicles';

Chart.register(CrosshairPlugin);

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ConcordiaMobilityRoutingModule,
    IonicModule.forRoot(),
    SharedModule,
    ConcordiaMapModule,
    ConcordiaTripsMapModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    ChartModule,
    ConcordiaMobilityStoreModule,
  ],
  declarations: [
    fleetsComponents,
    vehiclesComponents,
    driversComponents,
    sharedComponents,
    tripsComponents,
    TimeSeriesChartComponent,
    VehicleTrajectoryComponent,
    ChartCardComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConcordiaMobilityModule {}
