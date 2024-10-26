import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import { UserStateService } from '@concordia-nx-ionic/concordia-core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { LandingComponent as SuT } from './landing.component';

describe('LandingComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    mocks: [
      ConfigService,
      UserStateService,
    ],
    providers: [
    ],
    imports: [
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {

    expect(spectator.component)
      .toBeTruthy();
  });

});
