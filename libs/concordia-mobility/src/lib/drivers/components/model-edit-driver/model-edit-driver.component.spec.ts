import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  DriversApiService,
  FleetsApiService,
  RelatedUsersApiService,
  VehiclesApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { ModelEditDriverComponent as SuT } from './model-edit-driver.component';

describe('ModelNewDriverComponent', () => {
  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    imports: [
      IonicModule.forRoot(),
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      TranslocoTestingModule.forRoot({
        langs: { en: {}, es: {} },
        translocoConfig: {
          availableLangs: ['en', 'es'],
          defaultLang: 'en',
        },
      }),
    ],
    mocks: [
      DriversApiService,
      UINotificationStateService,
    ],
    providers: [
      ModalController,
      NavParams,
      {
        provide: FleetsApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of([])),
        },
      },
      {
        provide: VehiclesApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of([])),
        },
      },
      {
        provide: RelatedUsersApiService,
        useValue: {
          listDriversUsers: jest.fn().mockReturnValue(of([])),
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
