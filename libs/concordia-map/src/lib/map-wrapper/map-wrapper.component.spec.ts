import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import { UserStateService } from '@concordia-nx-ionic/concordia-core';
import { MAP_ELEMENT } from '@concordia-nx-ionic/concordia-shared';
import { Spectator } from '@ngneat/spectator';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { MapWrapperComponent as SuT } from './map-wrapper.component';

describe('MapWrapperComponent', () => {

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
        provide: MAP_ELEMENT,
        useValue: jest.fn(),
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
