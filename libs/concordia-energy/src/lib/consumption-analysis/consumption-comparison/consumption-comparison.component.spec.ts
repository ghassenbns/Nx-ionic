import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterStateService, UserStateService } from '@concordia-nx-ionic/concordia-core';
import { MetersConsumptionComparisonApiService } from '@concordia-nx-ionic/concordia-energy-api';
import { UserDatePipe } from '@concordia-nx-ionic/concordia-shared';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { ConsumptionComparisonComponent as SuT  } from './consumption-comparison.component';

describe('ConsumptionAnalysisViewComponent', () => {

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
      UserStateService,
      MetersConsumptionComparisonApiService,
      UserDatePipe,
    ],
    providers: [
      {
        provide: RouterStateService,
        useValue: {
          getQueryParam$: jest.fn().mockReturnValue(of( {})),
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
