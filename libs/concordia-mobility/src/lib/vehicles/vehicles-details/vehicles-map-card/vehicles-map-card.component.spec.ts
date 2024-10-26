import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VehiclesApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { of } from 'rxjs';

import { VehiclesMapCardComponent } from './vehicles-map-card.component';

describe('VehiclesMapCardComponent', () => {
  let spectator: Spectator<VehiclesMapCardComponent>;

  const createComponent = createComponentFactory({
    component: VehiclesMapCardComponent,
    providers: [
      mockProvider(VehiclesApiService, {
        getLastPosition: jest.fn().mockReturnValue(of({ data: {} })),
      }),
    ],
    schemas:[NO_ERRORS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the component and set cardConfig', () => {
    expect(spectator.component).toBeTruthy();
    expect(spectator.component.cardConfig).toBe(spectator.component.config);
  });

  // Add more test cases as needed
});
