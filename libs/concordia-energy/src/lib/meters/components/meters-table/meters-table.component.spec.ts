import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersApiService } from '@concordia-nx-ionic/concordia-api';
import { TimezonesStateService } from '@concordia-nx-ionic/concordia-api-store';
import { AppStateService, UserStateService } from '@concordia-nx-ionic/concordia-core';
import { MetersApiService } from '@concordia-nx-ionic/concordia-energy-api';
import { AlertService } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { MetersTableComponent as SuT } from './meters-table.component';

describe('MetersTableComponent', () => {

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
    providers: [
      {
        provide: UserStateService,
        useValue: {
          isSuperAdmin$: jest.fn().mockReturnValue(of([true])),
        },
      },
      {
        provide: MetersApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of({ data: [] })),
        },
      },
      {
        provide: UsersApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of({ data: [] })),
        },
      },
      {
        provide: TimezonesStateService,
        useValue: {
          loadTimezones: jest.fn(),
          getTimezones: jest.fn().mockReturnValue(of([])),
        },
      },
      {
        provide: ChangeDetectorRef,
        useValue: {
          detectChanges: jest.fn(),
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
