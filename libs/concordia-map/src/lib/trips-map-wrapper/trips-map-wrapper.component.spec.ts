import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import { UiStateService, UserStateService } from '@concordia-nx-ionic/concordia-core';
import { TRIPS_MAP_ELEMENT } from '@concordia-nx-ionic/concordia-shared';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { TripsMapWrapperComponent as SuT } from './trips-map-wrapper.component';

describe('TripsMapWrapperComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    mocks: [
      ConfigService,
      UserStateService,
    ],
    providers: [
      {
        provide: TRIPS_MAP_ELEMENT,
        useValue: jest.fn(),
      },
      {
        provide: UiStateService,
        useValue:{
         getMapStyle : jest.fn(),
        },
     },
    ],
    imports: [
      TranslocoTestingModule.forRoot({
        langs: { en: {}, es: {} },
        translocoConfig: {
          availableLangs: ['en', 'es'],
          defaultLang: 'en',
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {

    expect(spectator.component)
      .toBeTruthy();
  });

});
