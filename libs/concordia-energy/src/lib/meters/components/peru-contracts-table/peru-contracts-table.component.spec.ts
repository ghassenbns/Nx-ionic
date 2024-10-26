import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TimezonesStateService } from '@concordia-nx-ionic/concordia-api-store';
import { AppStateService, UserStateService } from '@concordia-nx-ionic/concordia-core';
import {
  MetersApiService,
  MetersContractsApiService,
  TariffsApiService,
} from '@concordia-nx-ionic/concordia-energy-api';
import { AlertService } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { PeruContractsTableComponent as SuT } from './peru-contracts-table.component';

describe('PeruContractsTableComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    mocks: [
      ActivatedRoute,
      Router,
      UINotificationStateService,
      ModalController,
      AlertService,
      AppStateService,
      TimezonesStateService,
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
    providers: [
      {
        provide: UserStateService,
        useValue: {
          isSuperAdmin$: jest.fn().mockReturnValue(of([true])),
        },
      },
      {
        provide: MetersApiService,
        useValue: {
          peruContractRecords: jest.fn().mockReturnValue(of({ data: [] })),
        },
      },
      {
        provide: MetersContractsApiService,
        useValue: {
          deletePeruContract: jest.fn().mockReturnValue(of({ data: [] })),
        },
      },
      {
        provide: TariffsApiService,
        useValue: {
          listPeruDepartments: jest.fn().mockReturnValue(of({ data: [] })),
          listPeruZones: jest.fn().mockReturnValue(of({ data: [] })),
          listPeruTariffs: jest.fn().mockReturnValue(of({ data: [] })),
          listPeruDistributors: jest.fn().mockReturnValue(of({ data: [] })),
          listPeruConnections: jest.fn().mockReturnValue(of({ data: [] })),
        },
      },
      {
        provide: ChangeDetectorRef,
        useValue: {
          detectChanges: jest.fn(),
        },
      },
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
