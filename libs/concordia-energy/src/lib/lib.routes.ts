import { Route } from '@angular/router';
import { AccessGuard } from '@concordia-nx-ionic/concordia-core';

import {
  ConsumptionComparisonComponent,
} from './consumption-analysis/consumption-comparison/consumption-comparison.component';
import { HierarchyDetailsComponent } from './hierarchy/hierarchy-details/hierarchy-details.component';
import { HierarchyListComponent } from './hierarchy/hierarchy-list/hierarchy-list.component';
import { MetersDetailsComponent } from './meters/meters-details/meters-details.component';
import { MetersListComponent } from './meters/meters-list/meters-list.component';

export const concordiaEnergyRoutes: Route[] = [
  {
    path: 'energy',
    children: [
      {
        path: '',
        redirectTo: 'meters',
        pathMatch: 'full',
      },
      {
        path: 'meters',
        canActivate: [AccessGuard],
        children: [
          {
            path: 'consumption_comparison',
            component: ConsumptionComparisonComponent,
          },
          {
            path: 'hierarchies',
            children: [
              {
                path: '',
                component: HierarchyListComponent,
              },
              {
                path: ':id',
                component: HierarchyDetailsComponent,
              },
            ],
          },
          {
            path: '',
            component: MetersListComponent,
          },
          {
            path: ':id',
            component: MetersDetailsComponent,
            data: {
              helpPanel: 'energy_meters_details',
            },
          },
        ],
      },
    ],
  },
];
