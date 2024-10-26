import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';

import { ChartCardComponent as SuT } from './chart-card.component';

describe('ChartCardComponent', () => {
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
    ],
  });

  beforeEach(() => {
    spectator = createHost(`<concordia-nx-ionic-chart-card
                            [loading]="loading"
                            [title]="title"
                            [data]="data"
                            ></concordia-nx-ionic-chart-card>`,
        {
          hostProps: {
            loading: false,
            title: 'title',
            data: true,
          },
        },
    );
  });

  it('should create', () => {

    expect(spectator.component)
        .toBeTruthy();
  });

});
