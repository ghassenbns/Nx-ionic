import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  FleetsApiService,
  VehiclesApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { ModalEditVehicleComponent as SuT } from './modal-edit-vehicle.component';

describe('ModalEditVehicleComponent', () => {
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
          listFuelType: jest.fn().mockReturnValue(of([])),
          listFuelCapacityType: jest.fn().mockReturnValue(of([])),
          listType: jest.fn().mockReturnValue(of([])),
        },
      },
      {
        provide: FleetsApiService,
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
