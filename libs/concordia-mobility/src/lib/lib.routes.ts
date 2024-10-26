import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessGuard } from '@concordia-nx-ionic/concordia-core';

import { DriversDetailsComponent } from './drivers/drivers-details/drivers-details.component';
import { DriversListComponent } from './drivers/drivers-list/drivers-list.component';
import { FleetsDetailsComponent } from './fleets/fleets-details/fleets-details.component';
import { FleetsListComponent } from './fleets/fleets-list/fleets-list.component';
import { TripAnalysisContainerComponent } from './trips/trip-analysis-container/trip-analysis-container.component';
import { TripsAnalysisComponent } from './trips/trips-analysis/trips-analysis.component';
import { TripsDetailsComponent } from './trips/trips-details/trips-details.component';
import { TripsListComponent } from './trips/trips-list/trips-list.component';
import { VehiclesDetailsComponent } from './vehicles/vehicles-details/vehicles-details.component';
import { VehiclesListComponent } from './vehicles/vehicles-list/vehicles-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'fleets',
        canActivate: [AccessGuard],
        children: [
          {
            path: '',
            component: FleetsListComponent,
          },
          {
            path: ':id',
            component: FleetsDetailsComponent,
          },
        ],
      },
      {
        path: 'drivers',
        canActivate: [AccessGuard],
        children: [
          {
            path: '',
            component: DriversListComponent,
          },
          {
            path: ':id',
            component: DriversDetailsComponent,
          },
        ],
      },
      {
        path: 'vehicles',
        canActivate: [AccessGuard],
        children: [
          {
            path: '',
            component: VehiclesListComponent,
          },
          {
            path: ':id',
            component: VehiclesDetailsComponent,
          },
        ],
      },
      {
        path: 'trips',
        canActivate: [AccessGuard],
        children: [
          {
            path: '',
            component: TripsListComponent,
          },
          {
            path: 'analysis',
            component: TripAnalysisContainerComponent,
            children: [
              {
                path: ':id',
                component: TripsAnalysisComponent,
              },
              {
                path: '',
                component: TripsAnalysisComponent,
              },
            ],
          },
          {
            path: ':id',
            component: TripsDetailsComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConcordiaMobilityRoutingModule {
}
