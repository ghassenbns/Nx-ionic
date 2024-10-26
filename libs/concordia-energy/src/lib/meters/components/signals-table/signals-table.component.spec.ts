import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppStateService } from '@concordia-nx-ionic/concordia-core';
import { METER_COUNTRIES, MetersApiService, MetersSignalsApiService } from '@concordia-nx-ionic/concordia-energy-api';
import { AlertService } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { SignalsTableComponent as SuT } from './signals-table.component';

describe('SignalsTableComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    mocks: [
      ActivatedRoute,
      AlertService,
      UINotificationStateService,
      AppStateService,
      ModalController,
    ],
    providers: [
      {
        provide: MetersApiService,
        useValue: {
          signalsTypeList: jest.fn().mockReturnValue(of([true])),
          signalsSubtypeList: jest.fn().mockReturnValue(of([true])),
        },
      },
      {
        provide: MetersSignalsApiService,
        useValue: {
          delete: jest.fn().mockReturnValue(of([true])),
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
    spectator.component.meter = {
      timezone: {
        timezoneId: 12,
        name: '',
        shortName: 'Europe/Madrid',
      },
      _id: '',
      clientId: '',
      customInfo: [],
      customInfoEnabled: false,
      description: '',
      isDeletable: false,
      isEditable: false,
      isPublic: false,
      latestTariffEnabled: false,
      localization: { address: '', latitude: 0, longitude: 0 },
      meterType: '',
      name: '',
      owner: { creatorUserId: 0, email: '', name: '', userId: 0, userLevelId: 0 },
      ownerId: 0,
      ref: '',
      timezoneId: 0,
      country: METER_COUNTRIES.PERU,
    };

  });

  it('should create', () => {

    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();

  });
});
