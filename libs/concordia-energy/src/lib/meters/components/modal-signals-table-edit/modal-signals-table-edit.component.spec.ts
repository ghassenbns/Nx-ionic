import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ModalSignalsTableEditComponent as SuT  } from './modal-signals-table-edit.component';

describe('ModalSignalsTableEditComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
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
