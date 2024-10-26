import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TripStateService } from '@concordia-nx-ionic/concordia-mobility-store';
import { IonicModule } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { TimeSeriesChartComponent as SuT } from './time-series-chart.component';

describe('TimeSeriesChartComponent', () => {
  let spectator: SpectatorHost<SuT>;

  const createHost = createHostFactory({
    template: '',
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    imports: [
      IonicModule,
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
        provide: TripStateService,
        useValue: {
          toggleZoomTime: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createHost(`<concordia-nx-ionic-time-series-chart
                            [signals]="signals"
                            [ts]="ts"
                            [vehicleSignalTypeName]="vehicleSignalTypeIds"
                            ></concordia-nx-ionic-time-series-chart>`,
      {
        hostProps: {
          signals: [],
          ts: 'DD/MM/YYYY HH:mm:ss',
          vehicleSignalTypeIds: [],
        },
      },
    );
  });

  it('should create', () => {

    expect(spectator.component)
      .toBeTruthy();
  });

});
