import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';

import { AuthContainerComponent as SuT } from './auth-container.component';

describe('AuthContainerComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    mocks: [
      ConfigService,
      TranslocoService,
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
