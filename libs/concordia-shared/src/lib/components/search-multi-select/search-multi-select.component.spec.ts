import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestElementFinder } from '@concordia-nx-ionic/concordia-util';
import { IonicModule, ModalController, PopoverController } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';

import { SearchMultiSelectComponent as SuT } from './search-multi-select.component';

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
  // mocks: [
  //   PopoverController,
  // ],
  providers: [
    PopoverController,
    ModalController,
  ],
});

describe('EditItemComponent', () => {

  let spectator: SpectatorHost<SuT>;
  beforeEach(() => {

    spectator = createHost(`<concordia-ng-shared-search-multi-select [(ngModel)]="model"
                                                       [name]="name"
                                                       [label]="label"
                                                       [optionsValue]="optionsValue"
                                                       [required]="required"
                                                       [disabled]="disabled"
                                                       [options]="options">
                            </concordia-ng-shared-search-multi-select>`, {
      hostProps: {
        model: [1],
        label: 'test',
        name: 'test',
        required: true,
        disabled: false,
        optionsValue: '_id',
        options: [
          { _id: 1, name: '1' },
          { _id: 2, name: '2' },
        ],
      },
    });
  });

  const elements = TestElementFinder.configureSpectatorFinder([
    'multiSelect',
    'multiSelectInp',
    'popover',
    'searchbar',
    ['item', 'multiple'],
    ['group', 'multiple'],
  ]);

  it('should create', () => {

    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();

  });

  it('should open popover after click', () => {
    spectator.detectChanges();
    expect(spectator.component.isOpen).not.toBeTruthy();

    const els = elements(spectator);

    expect(els.multiSelect).not.toBeNull();

    jest.spyOn(spectator.component, 'presentPopover');
    els.multiSelect.click();
    expect(spectator.component.presentPopover).toBeCalledTimes(1);
    expect(spectator.component.isOpen).toBeTruthy();

  });

  it('should show clean button', () => {
    spectator.detectChanges();
    const els = elements(spectator);

    expect(els.multiSelect.required).toBeTruthy();
  });

  it('should show not clean button', () => {
    spectator.detectChanges();
    spectator.setInput('required', false);

    const els = elements(spectator);

    expect(els.multiSelect.required).toBeFalsy();
  });

  it('should be disabled', () => {
    spectator.detectChanges();
    spectator.setInput('disabled', true);

    const els = elements(spectator);

    expect(els.multiSelect.disabled).toBeTruthy();
  });
});
