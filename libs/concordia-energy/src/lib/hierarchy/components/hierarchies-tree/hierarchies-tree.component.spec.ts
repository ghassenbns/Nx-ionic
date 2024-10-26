import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterStateService } from '@concordia-nx-ionic/concordia-core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { HierarchiesTreeComponent as SuT  } from './hierarchies-tree.component';

describe('HierarchiesTreeComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    mocks: [
      RouterStateService,
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
