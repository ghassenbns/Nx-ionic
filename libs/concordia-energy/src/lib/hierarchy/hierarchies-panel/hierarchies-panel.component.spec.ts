import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterStateService, UiStateService } from '@concordia-nx-ionic/concordia-core';
import { HierarchiesStateService } from '@concordia-nx-ionic/concordia-energy-store';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { HierarchiesPanelComponent as SuT } from './hierarchies-panel.component';

describe('HierarchiesPanelComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    mocks: [
      UiStateService,
      RouterStateService,
    ],
    providers: [
      { provide: HierarchiesStateService,
        useValue: {
          getSelectedHierarchies: jest.fn().mockReturnValue(of('111')),
          getHierarchiesIdListLoading: jest.fn().mockReturnValue(of(false)),
          getHierarchiesIdList: jest.fn().mockReturnValue(of([])),
        },
      },
    ],
    imports: [
      TranslocoTestingModule.forRoot({
        langs: { en: {}, es: {} },
        translocoConfig: {
          availableLangs: ['en', 'es'],
          defaultLang: 'en',
        },
      }),
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
