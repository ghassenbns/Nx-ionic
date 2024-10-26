import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DriversApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { of } from 'rxjs';

import { MOCK_DRIVER_DATA } from '../../../mocks/driver';
import { DriversMapCardComponent } from './drivers-map-card.component';

describe('DriversMapCardComponent', () => {
  let spectator: Spectator<DriversMapCardComponent>;
  const driver = MOCK_DRIVER_DATA;

  const createComponent = createComponentFactory({
    component: DriversMapCardComponent,
    providers: [
      mockProvider(DriversApiService, {
        getLastPosition: jest.fn().mockReturnValue(of({ data: {} })),
      }),
    ],
    schemas:[NO_ERRORS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.component.driver = driver;
  });

  it('should create the component and set cardConfig', () => {
    expect(spectator.component).toBeTruthy();
    expect(spectator.component.cardConfig).toBe(spectator.component.config);
  });

  // Add more test cases as needed
});
