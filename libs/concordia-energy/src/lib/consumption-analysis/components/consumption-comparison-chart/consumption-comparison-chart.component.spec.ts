import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserDateFormatPipe, UserDatePipe, UserNumberPipe } from '@concordia-nx-ionic/concordia-shared';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { ConsumptionComparisonChartComponent as SuT  } from'./consumption-comparison-chart.component';

describe('ConsumptionComparisonChartComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    mocks: [
      UserDatePipe,
      UserNumberPipe,
      UserDateFormatPipe,
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
  });

  beforeEach(() => {

    spectator = createComponent();

  });

  it('should create', () => {

    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();

  });
});
