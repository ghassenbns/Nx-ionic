import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersApiService, UsersRelationshipsApiService } from '@concordia-nx-ionic/concordia-api';
import { TimezonesStateService } from '@concordia-nx-ionic/concordia-api-store';
import { UserStateService } from '@concordia-nx-ionic/concordia-core';
import { MetersApiService } from '@concordia-nx-ionic/concordia-energy-api';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { ModalEditMeterComponent as SuT  } from './modal-edit-meter.component';

describe('ModalEditMeterComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    mocks: [
      ModalController,
      NavParams,
      UINotificationStateService,
    ],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      TranslocoTestingModule,
    ],
    providers: [
      {
        provide: MetersApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of([])),
        },
      },
      {
        provide: UsersApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of([])),
        },
      },
      {
        provide: UserStateService,
        useValue: {
          getUser$: jest.fn().mockReturnValue(of({})),
        },
      },
      {
        provide: UsersRelationshipsApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of([])),
        },
      },
      {
        provide: TimezonesStateService,
        useValue: {
          loadTimezones: jest.fn(),
          getTimezones: jest.fn().mockReturnValue(of([])),
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
