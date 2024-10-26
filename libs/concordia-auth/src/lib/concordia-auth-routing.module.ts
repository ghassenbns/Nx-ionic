import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthContainerComponent } from './auth-container/auth-container.component';
import { LoginComponent } from './login/login.component';
import { ResetComponent } from './reset/reset.component';

const routes: Routes = [
  {
    path: '',
    component: AuthContainerComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'reset',
        component: ResetComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class ConcordiaAuthRoutingModule {
}
