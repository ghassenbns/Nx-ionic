import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersApiService } from '@concordia-nx-ionic/concordia-api';
import { RouterStateService, UserStateService } from '@concordia-nx-ionic/concordia-core';
import { MetersApiService } from '@concordia-nx-ionic/concordia-energy-api';
import { MetersStateService } from '@concordia-nx-ionic/concordia-energy-store';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { ConsumptionComparisonFilterComponent as SuT  } from './consumption-comparison-filter.component';

describe('ConsumptionComparisonFilterComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    mocks: [
      UsersApiService,
      MetersApiService,
      RouterStateService,
      UINotificationStateService,
      MetersStateService,
    ],
    imports: [
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
    providers: [
      {
        provide: UserStateService,
        useValue: {
          isAdminMore$: jest.fn().mockReturnValue(of([true])),
          getUser$: jest.fn().mockReturnValue(of([{}])),
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
