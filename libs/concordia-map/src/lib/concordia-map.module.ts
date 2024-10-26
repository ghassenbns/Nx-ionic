import { defineCustomElement } from '@advanticsys/map-components/dist/components/concordia-map';
import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from '@angular/core';
import { MAP_ELEMENT } from '@concordia-nx-ionic/concordia-shared';

import { components } from '.';
@NgModule({
  imports: [CommonModule],
  declarations: [...components],
  providers: [
    {
      provide: MAP_ELEMENT,
      useValue: defineCustomElement,
    },
  ],
  exports: [...components],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConcordiaMapModule {}
