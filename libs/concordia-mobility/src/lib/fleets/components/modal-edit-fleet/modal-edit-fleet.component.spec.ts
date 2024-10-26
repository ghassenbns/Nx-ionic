import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserStateService } from '@concordia-nx-ionic/concordia-core';
import {
  DriversApiService,
  FleetsApiService,
  RelatedUsersApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { ModalEditFleetComponent as SuT } from './modal-edit-fleet.component';

describe('ModalEditFleetComponent', () => {
  const relatedOwners: any[] = [];
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
      DriversApiService,
      FleetsApiService,
      UINotificationStateService,
    ],
    providers: [
      {
        provide: RelatedUsersApiService,
        useValue: {
          listOwners: jest.fn().mockReturnValue(of(relatedOwners)),
        },
      },
      {
        provide: UserStateService,
        useValue: {
          getUser$: jest.fn().mockReturnValue(of(relatedOwners)),
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
