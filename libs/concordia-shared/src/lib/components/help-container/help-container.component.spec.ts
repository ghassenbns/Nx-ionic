import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import {
  UiStateService,
  UserStateService,
  VersionStateService,
} from '@concordia-nx-ionic/concordia-core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { HelpContainerComponent as SuT  } from './help-container.component';

describe('HelpContainerComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    imports: [
      TranslocoTestingModule.forRoot({
        langs: { en: {}, es: {} },
        translocoConfig: {
          availableLangs: ['en', 'es'],
          defaultLang: 'en',
        },
      }),
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    providers: [
      {
        provide: UiStateService,
        useValue: {
          showHelpPanel: jest.fn().mockReturnValue(of( true)),
          helpPanel: jest.fn().mockReturnValue(of( '')),
          helpSubPanel: jest.fn().mockReturnValue(of( '')),
        },
      },
      {
        provide: UserStateService,
        useValue: {
          getLocaleAbr$: jest.fn().mockReturnValue(of( 'en')),
          getUserTheme$: jest.fn().mockReturnValue(of( 'light')),
        },
      },
    ],
    mocks: [
      ConfigService,
      VersionStateService,
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
