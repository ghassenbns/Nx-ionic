import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';

import { TripsCardComponent as SuT } from './trips-card.component';

describe('TripsCardComponent', () => {
  let spectator: SpectatorHost<SuT>;
  const modalControllerMock = {
    create: jest.fn(() => Promise.resolve({ present: jest.fn() })),
  };

  const createHost = createHostFactory({
    template: '',
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    providers: [
      { provide: ModalController, useValue: modalControllerMock },
    ],
  });

  beforeEach(() => {
    spectator = createHost(`<concordia-nx-ionic-trips-card [trip]="trip" [editMode]="editMode">
</concordia-nx-ionic-trips-card>`,
      {
        hostProps: {
          trip: {},
          editMode: {},
        },
      },
    );
  });

  it('should create', () => {

    expect(spectator.component)
      .toBeTruthy();
  });

});
