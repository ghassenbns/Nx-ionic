import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { services } from './services';
import { ENVIRONMENT, VERSION } from './tokens';

@NgModule({
  imports: [
    CommonModule,
  ],
})
export class ConcordiaConfigModule {
  static forRoot(environment: any, version: string): ModuleWithProviders<ConcordiaConfigModule> {
    return {
      ngModule: ConcordiaConfigModule,
      providers: [
        ...services,
        { provide: ENVIRONMENT, useValue: environment },
        { provide: VERSION, useValue: version },
      ],
    };
  }
}
