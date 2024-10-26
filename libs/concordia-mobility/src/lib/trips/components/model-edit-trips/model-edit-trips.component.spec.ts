import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService, UserStateService } from '@concordia-nx-ionic/concordia-core';
import {
  DriversApiService,
  FleetsApiService,
  TripsApiServices,
  VehiclesApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import { AlertService } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { ModelEditTripsComponent as SuT } from './model-edit-trips.component';

describe('ModelEditTripsComponent', () => {

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
      TripsApiServices,
      NavParams,
    ],
    imports: [TranslocoTestingModule],
    providers: [
      {
        provide: FleetsApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of({})),
        },
      },
      {
        provide: DriversApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of({})),
        },
      },
      {
        provide: VehiclesApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of({})),
        },
      },
      {
        provide: UserStateService,
        useValue: {
          getTZ$: jest.fn().mockReturnValue(of('UTC')),
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
