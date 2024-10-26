import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { VehicleTrajectoryComponent as SuT } from './vehicle-trajectory.component';

describe('VehicleTrajectoryComponent', () => {
  let spectator: SpectatorHost<SuT>;

  const createHost = createHostFactory({
    template: '',
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
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
    spectator = createHost(`<concordia-nx-ionic-vehicle-trajectory></concordia-nx-ionic-vehicle-trajectory>`,
      {
        hostProps: {
        },
      },
    );
  });

  it('should create', () => {

    expect(spectator.component)
      .toBeTruthy();
  });

});
