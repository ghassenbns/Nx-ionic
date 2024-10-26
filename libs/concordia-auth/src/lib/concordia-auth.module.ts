import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthEffects } from '@concordia-nx-ionic/concordia-core';
import { SharedModule } from '@concordia-nx-ionic/concordia-shared';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';

import { AuthContainerComponent } from './auth-container/auth-container.component';
import { ConcordiaAuthRoutingModule } from './concordia-auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ResetComponent } from './reset/reset.component';

@NgModule({
  declarations: [LoginComponent, AuthContainerComponent, ResetComponent],
  imports: [
    CommonModule,
    ConcordiaAuthRoutingModule,
    TranslocoModule,
    IonicModule.forRoot(),
    EffectsModule.forFeature([AuthEffects]),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ConcordiaAuthModule {}
