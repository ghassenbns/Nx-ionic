import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestElementFinder } from '@concordia-nx-ionic/concordia-util';
import { IonicModule, ModalController, PopoverController } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';

import { SelectSearchComponent as SuT } from './select-search.component';

const createHost = createHostFactory({
  component: SuT,
  detectChanges: false,
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  mocks: [
    PopoverController,
  ],
  providers: [
    ModalController,
  ],
});

describe('EditItemComponent', () => {

  let spectator: SpectatorHost<SuT>;
  beforeEach(() => {

    spectator = createHost(`<concordia-ng-shared-select-search [(ngModel)]="model"
                                                       [name]="name"
                                                       [options]="options">
                            </concordia-ng-shared-select-search>`, {
      hostProps: {
        model: '1',
        name: '_id',
        options: [
          { _id: 1, name: '1' },
          { _id: 2, name: '2' },
        ],
      },
    });
  });

  const elements = TestElementFinder.configureSpectatorFinder([
    'selectSearchInput',
  ]);

  it('should create', () => {

    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();

  });

  it('should create input', () => {

    spectator.detectChanges();

    const els = elements(spectator);

    expect(els.selectSearchInput.name).toBe('_id');

  });
});
