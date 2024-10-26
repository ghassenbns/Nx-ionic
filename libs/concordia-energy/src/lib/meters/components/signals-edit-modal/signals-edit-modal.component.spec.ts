import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserStateService } from '@concordia-nx-ionic/concordia-core';
import { MetersApiService, MetersSignalsApiService } from '@concordia-nx-ionic/concordia-energy-api';
import { CompSignalsApiService, NodesViewApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { SignalsEditModalComponent as SuT } from './signals-edit-modal.component';

describe('SignalsEditModalComponent', () => {
  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    mocks: [
      ModalController,
      UINotificationStateService,
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
        provide: NodesViewApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of([true])),
        },
      },
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
          updateSignal: jest.fn().mockReturnValue(of([true])),
          storeSignal: jest.fn().mockReturnValue(of([true])),
        },
      },
      {
        provide: CompSignalsApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of([true])),
        },
      }],
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

    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();

  });
});
