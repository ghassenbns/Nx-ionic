import { Route } from '@angular/router';
import { AuthGuard } from '@concordia-nx-ionic/concordia-core';

import { AppContainerComponent } from './containers/app-container/app-container.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AppContainerComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('@concordia-nx-ionic/concordia-auth').then(m => m.ConcordiaAuthModule),
      },
      {
        path: 'landing',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () =>
              import('@concordia-nx-ionic/concordia-landing').then(m => m.ConcordiaLandingModule),
          },
        ],
      },
      {
        path: '',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () =>
              import('@concordia-nx-ionic/concordia-energy').then(m => m.ConcordiaEnergyModule),
          },
          {
            path: '**',
            redirectTo: 'landing',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'landing',
        pathMatch: 'full',
      },
    ],
  },
];
