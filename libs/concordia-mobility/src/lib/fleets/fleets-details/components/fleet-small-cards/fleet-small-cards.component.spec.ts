import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SpectatorElement } from '@ngneat/spectator';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { MOCK_FLEET_DATA } from '../../../../mocks/fleet';
import { FleetSmallCardsComponent } from './fleet-small-cards.component';

describe('FleetSmallCardsComponent', () => {
  let spectator: Spectator<FleetSmallCardsComponent>;
  const fleet = MOCK_FLEET_DATA;
  const createComponent = createComponentFactory({
    component: FleetSmallCardsComponent,
    imports: [
      IonicModule.forRoot(),
      EffectsModule.forRoot([]),
      StoreModule.forRoot([]),
      TranslocoTestingModule.forRoot({
        langs: { en: {}, es: {} },
        translocoConfig: {
          availableLangs: ['en', 'es'],
          defaultLang: 'en',
        },
      }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  });

  beforeEach(() => {
    spectator = createComponent({
      props: { fleet },
    });
  });

  afterEach(() => {
    jest.spyOn(console, 'error').mockImplementation();
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display the correct fleet manager count', () => {
    const managerCount = 3;
    spectator.component.fleet = fleet;
    spectator.component.fleet.managerIds = [1, 2, 3];
    spectator.detectChanges();

    const managerCard = spectator.query('[data-test-id="managersSmallCard"]') as SpectatorElement & {name : string};

    expect(managerCard.name).toEqual(managerCount.toString());
  });
});
