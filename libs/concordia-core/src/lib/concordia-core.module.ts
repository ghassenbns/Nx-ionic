import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { guards } from './guards';
import { states } from './stores/states';

@NgModule({
  imports: [CommonModule],
})
export class ConcordiaCoreModule {
  static forRoot(): ModuleWithProviders<ConcordiaCoreModule> {
    return {
      ngModule: ConcordiaCoreModule,
      providers: [
        ...states,
        ...guards,
      ],
    };
  }
}
