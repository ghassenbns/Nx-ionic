import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterStateService } from '@concordia-nx-ionic/concordia-core';
import { MetersStateService } from '@concordia-nx-ionic/concordia-energy-store';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { MeterLatestTariffCardComponent as SuT } from './latest-tariff-card.component';

describe('MeterLatestTariffCardComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    mocks: [
      MetersStateService,
      RouterStateService,
    ],
    imports: [
      TranslocoTestingModule.forRoot({
        langs: {
          en: {
            table: {
              createNew: 'Create new',
              edit: 'Edit',
              clone: 'Clone',
            },
            entities: {
              table: 'table',
            },
          }, es: {},
        },
        translocoConfig: {
          availableLangs: ['en', 'es'],
          defaultLang: 'en',
        },
      }),
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
  });

  beforeEach(() => {

    spectator = createComponent();

  });

  it('should create', () => {

    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();

  });
});
