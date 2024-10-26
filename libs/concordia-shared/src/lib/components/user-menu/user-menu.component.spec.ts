import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';

import { UserMenuComponent as SuT } from './user-menu.component';

describe('UserMenuComponent', () => {

  let spectator: SpectatorHost<SuT>;

  const createHost = createHostFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
  });

  beforeEach(() => {
    spectator = createHost(`<concordia-ng-shared-user-menu [name]="name"></concordia-ng-shared-user-menu>`,
      {
        hostProps: {
          name: 'Name',
        },
      },
    );
  });

  it('should create', () => {

    expect(spectator.component)
      .toBeTruthy();
  });

  it('should create', () => {
    jest.spyOn(spectator.component.logout, 'emit');
    spectator.component.logOut();
    expect(spectator.component.logout.emit).toHaveBeenCalled();
  });
});
