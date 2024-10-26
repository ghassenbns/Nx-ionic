import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UiStateService } from '@concordia-nx-ionic/concordia-core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { of } from 'rxjs';

import { TripAnalysisContainerComponent as SuT } from './trip-analysis-container.component';

describe('TripAnalysisContainerComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    imports: [
    ],
    mocks: [
    ],
    providers: [
      {
        provide: UiStateService,
        useValue: {
          showRightPanel: jest.fn().mockReturnValue(of( false)),
          showRightMenu: jest.fn().mockReturnValue(of( true)),
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
