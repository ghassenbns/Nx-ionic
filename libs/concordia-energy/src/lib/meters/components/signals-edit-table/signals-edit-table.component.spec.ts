import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppStateService } from '@concordia-nx-ionic/concordia-core';
import { MetersApiService, MetersSignalsApiService } from '@concordia-nx-ionic/concordia-energy-api';
import { CompSignalsApiService, NodesViewApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import { AlertService } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { SignalsEditTableComponent as SuT } from './signals-edit-table.component';

describe('SignalsEditTableComponent', () => {

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
      NavParams,
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
      {
        provide: NodesViewApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of([true])),
        },
      },
      {
        provide: CompSignalsApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of([true])),
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
    spectator.component.loading = {};
  });

  it('should create', () => {

    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();

  });
});
