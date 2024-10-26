import { defineCustomElement } from '@advanticsys/map-components/dist/components/concordia-trips-map';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TRIPS_MAP_ELEMENT } from '@concordia-nx-ionic/concordia-shared';

import { TripsMapWrapperComponent } from './trips-map-wrapper/trips-map-wrapper.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TripsMapWrapperComponent],
  providers: [
    {
      provide: TRIPS_MAP_ELEMENT,
      useValue: defineCustomElement,
    },
  ],
  exports: [TripsMapWrapperComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class ConcordiaTripsMapModule {}
