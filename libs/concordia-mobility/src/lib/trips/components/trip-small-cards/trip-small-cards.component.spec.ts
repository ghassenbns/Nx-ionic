import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestElementFinder } from '@concordia-nx-ionic/concordia-util';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { MOCK_TRIP_DATA } from '../../../mocks/trip';
import { TripSmallCardsComponent as SuT } from './trip-small-cards.component';

describe('TripSmallCardsComponent', () => {

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
    spectator = createHost(`<concordia-nx-ionic-trip-small-cards [trip]="trip"></concordia-nx-ionic-trip-small-cards>`,
      {
        hostProps: {
          trip: MOCK_TRIP_DATA,
        },
      },
    );
  });

  const elements = TestElementFinder.configureSpectatorFinder([
    ['item', 'multiple'],
  ]);

  it('should create', () => {
    expect(spectator.component)
      .toBeTruthy();
  });

  it('should be 3 card', () => {
    spectator.detectChanges();
    const els = elements(spectator);

    expect(els.item.length).toBe(3);
  });
});
