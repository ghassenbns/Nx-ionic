import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

import { SpainContractsEditModalComponent as SuT } from './spain-contracts-edit-modal.component';

describe('SpainContractsEditModalComponent', () => {

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
      FormsModule,
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
          spainContractRecords: jest.fn().mockReturnValue(of({ data: [] })),
        },
      },
      {
        provide: MetersContractsApiService,
        useValue: {
          deleteSpainContract: jest.fn().mockReturnValue(of({ data: [] })),
        },
      },
      {
        provide: TariffsApiService,
        useValue: {
          listSpainZones: jest.fn().mockReturnValue(of({ data: [] })),
          listSpainSellers: jest.fn().mockReturnValue(of({ data: [] })),
          listSpainDistributors: jest.fn().mockReturnValue(of({ data: [] })),
          listSpainTariffs: jest.fn().mockReturnValue(of({ data: [] })),
          listSpainBillingTypes: jest.fn().mockReturnValue(of({ data: [] })),
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
