import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import {
  AppStateService,
  AuthService,
  RouterStateService,
  ThemeService,
  UserStateService,
  VersionStateService,
} from '@concordia-nx-ionic/concordia-core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { of } from 'rxjs';

import { AppContainerComponent as SuT } from './app-container.component';

describe('AppContainerComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    mocks: [
      ConfigService,
      AuthService,
      UserStateService,
      RouterStateService,
      VersionStateService,
    ],
    providers: [
      { provide: AppStateService,
        useValue: {
          getScopes$: jest.fn().mockReturnValue(of(['1'])),
        },
      },
      { provide: UserStateService,
        useValue: {
          getUserTheme: jest.fn().mockReturnValue(of('dark')),
        },
      },
      { provide: ThemeService,
        useValue: {
          setTheme: jest.fn(),
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
