import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ConsumptionComparisonTableComponent as SuT  } from './consumption-comparison-table.component';

describe('ConsumptionComparisonTableComponent', () => {

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
