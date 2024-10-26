import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ConcordiaConfigModule } from '@concordia-nx-ionic/concordia-config';

import { clients } from './clients';

@NgModule({
  imports: [
    CommonModule,
    ConcordiaConfigModule,
  ],
  declarations: [],
})
export class ConAuthApiModule {
  static forRoot(): ModuleWithProviders<ConAuthApiModule> {
    return {
      ngModule: ConAuthApiModule,
      providers: [
        ...clients,
      ],
    };
  }
}
