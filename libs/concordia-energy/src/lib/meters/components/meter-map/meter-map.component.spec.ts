import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UiStateService } from '@concordia-nx-ionic/concordia-core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { of } from 'rxjs';

import { MeterMapComponent as SuT } from './meter-map.component';

describe('MeterMapComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    providers: [
      {
        provide: UiStateService,
        useValue: {
          showMenu: jest.fn().mockReturnValue(of(false)),
          showRightPanel: jest.fn().mockReturnValue(of(false)),
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
