import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UsersApiService, UsersRelationshipsApiService } from '@concordia-nx-ionic/concordia-api';
import { UserStateService } from '@concordia-nx-ionic/concordia-core';
import { HierarchiesApiService } from '@concordia-nx-ionic/concordia-energy-api';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { ModalEditHierarchyComponent as SuT } from './modal-edit-hierarchy.component';

describe('ModalEditHierarchyComponent', () => {
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
      HierarchiesApiService,
      UINotificationStateService,
      UsersRelationshipsApiService,
    ],
    providers: [
      {
        provide: UserStateService,
        useValue: {
          getUser$: jest.fn().mockReturnValue(of([])),
        },
      },
      {
        provide: UsersApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of({ data: [] })),
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
