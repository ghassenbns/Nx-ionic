import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UiStateService, UserStateService } from '@concordia-nx-ionic/concordia-core';
import { TestElementFinder } from '@concordia-nx-ionic/concordia-util';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { LayoutComponent as SuT } from './layout.component';

describe('LayoutComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    imports: [
      TranslocoTestingModule.forRoot({
        langs: {
          en: {
            table: {
              createNew: 'Create new',
              edit: 'Edit',
              clone: 'Clone',
            },
            entities: {
              table: 'table',
            },
          }, es: {},
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
    mocks: [
      UiStateService,
      UserStateService,
    ],
  });

  beforeEach(() => {

    spectator = createComponent();

  });

  const elements = TestElementFinder.configureSpectatorFinder([
    'toggleMenuBtn',
  ]);

  it('should create', () => {

    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();

  });

  it('should emit logOut event', () => {
    const emitSpy = jest.spyOn(spectator.component.logout, 'emit');
    spectator.component.logOut();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit logOut event', () => {
    const els = elements(spectator);
    jest.spyOn(spectator.component, 'onToggle');
    els.toggleMenuBtn.click();

    expect(spectator.component.onToggle).toBeCalledTimes(1);
  });
});
