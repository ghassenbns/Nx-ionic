import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService, UserStateService } from '@concordia-nx-ionic/concordia-core';
import {
  MetersApiService,
  MetersContractsApiService,
  TariffsApiService,
} from '@concordia-nx-ionic/concordia-energy-api';
import { AlertService } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { PeruContractsEditModalComponent as SuT } from './peru-contracts-edit-modal.component';

describe('PeruContractsEditModalComponent', () => {

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
      NavParams,
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
          delete: jest.fn().mockReturnValue(of({ data: [] })),
        },
      },
      {
        provide: TariffsApiService,
        useValue: {
          listPeruZones: jest.fn().mockReturnValue(of({ data: [] })),
          listPeruDepartments: jest.fn().mockReturnValue(of({ data: [] })),
          listPeruConnections: jest.fn().mockReturnValue(of({ data: [] })),
          listPeruTariffs: jest.fn().mockReturnValue(of({ data: [] })),
          listPeruDistributors: jest.fn().mockReturnValue(of({ data: [] })),
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
