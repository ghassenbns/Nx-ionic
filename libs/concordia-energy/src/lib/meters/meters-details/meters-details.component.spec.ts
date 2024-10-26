import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppStateService, RouterStateService } from '@concordia-nx-ionic/concordia-core';
import { MetersStateService } from '@concordia-nx-ionic/concordia-energy-store';
import { ModalController } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { MetersDetailsComponent as SuT } from './meters-details.component';

describe('MetersViewComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    mocks: [
      RouterStateService,
      MetersStateService,
      ModalController,
    ],
    imports: [
      TranslocoTestingModule.forRoot({
        langs: {
          en: {},
          es: {},
        },
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
        provide: AppStateService,
        useValue: {
          getScopes$: jest.fn().mockReturnValue(of(['1'])),
          hasRight$: jest.fn().mockReturnValue(of(true)),
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
