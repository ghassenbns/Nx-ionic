import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UsersApiService, UsersRelationshipsApiService } from '@concordia-nx-ionic/concordia-api';
import { AuthApiService } from '@concordia-nx-ionic/concordia-auth-api';
import { RouterStateService, UiStateService } from '@concordia-nx-ionic/concordia-core';
import { HierarchiesApiService } from '@concordia-nx-ionic/concordia-energy-api';
import { MetersStateService } from '@concordia-nx-ionic/concordia-energy-store';
import { AlertService } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { HierarchyDetailsComponent as SuT  } from './hierarchy-details.component';

describe('HierarchyDetailsComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    imports: [
      HttpClientTestingModule,
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
      RouterStateService,
      MetersStateService,
      UINotificationStateService,
      AlertService,
      UiStateService,
      HierarchiesApiService,
      UsersRelationshipsApiService,
    ],
    providers: [
      AuthApiService,
      {
        provide: UsersApiService,
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
