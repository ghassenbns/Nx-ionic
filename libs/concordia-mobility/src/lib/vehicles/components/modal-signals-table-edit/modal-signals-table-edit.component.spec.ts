import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  CompSignalsApiService,
  DriversApiService,
  FleetsApiService, NodesViewApiService,
  RelatedUsersApiService,
  VehiclesApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { ModalSignalsTableEditComponent as SuT  } from './modal-signals-table-edit.component';

describe('ModalSignalsTableEditComponent', () => {
  const relatedOwners: any[] = [];

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
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
    mocks: [
      UINotificationStateService,
      ModalController,
      NavParams,
      DriversApiService,
      FleetsApiService,
      RelatedUsersApiService,
    ],
    providers: [
      {
        provide: VehiclesApiService,
        useValue: {
          listSignalType: jest.fn().mockReturnValue(of(relatedOwners)),
        },
      },
      {
        provide: NodesViewApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of(relatedOwners)),
        },
      },
      {
        provide: CompSignalsApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of(relatedOwners)),
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
