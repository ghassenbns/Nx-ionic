import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  CompSignalsApiService, NodesViewApiService, VehiclesApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { ModalEditSignalComponent as SuT } from './modal-edit-signal.component';

describe('ModalEditSignalComponent', () => {
  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    imports: [
      TranslocoTestingModule.forRoot({
        langs: { en: {}, es: {} },
        translocoConfig: {
          availableLangs: ['en', 'es'],
          defaultLang: 'en',
        },
      }),
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    mocks: [
      NavParams,
      ModalController,
      UINotificationStateService,
    ],
    providers: [
      {
        provide: VehiclesApiService,
        useValue: {
          listSignalType: jest.fn().mockReturnValue(of([])),
        },
      },
      {
        provide: NodesViewApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of([])),
        },
      },
      {
        provide: CompSignalsApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of([])),
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
