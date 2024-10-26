import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import {
  RouterStateService,
  UiStateService,
  UserStateService,
  VersionStateService,
} from '@concordia-nx-ionic/concordia-core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { PageComponent as SuT  } from './page.component';

describe('PageComponent', () => {

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
          showRightPanel: jest.fn().mockReturnValue(of( false)),
          showRightMenu: jest.fn().mockReturnValue(of( true)),
          showHelpPanel: jest.fn().mockReturnValue(of( true)),
          showHelpMenu: jest.fn().mockReturnValue(of( false)),
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
      {
        provide: RouterStateService,
        useValue: {
          getUrl$: jest.fn().mockReturnValue(of( '/energy/meters')),
        },
      },
    ],
    mocks: [
      ActivatedRoute,
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
