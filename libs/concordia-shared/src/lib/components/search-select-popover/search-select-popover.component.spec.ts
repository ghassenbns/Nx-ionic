import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestElementFinder } from '@concordia-nx-ionic/concordia-util';
import { NavParams, PopoverController } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { SearchSelectPopoverComponent as SuT } from './search-select-popover.component';

describe('SearchSelectPopoverComponent', () => {

  let spectator: Spectator<SuT>;

  const navParams = {
    data: [
      { id: 1, groupId: 1, name: 'name 1' },
      { id: 2, groupId: 1, name: 'name 2' },
      { id: 3, groupId: 2, name: 'name 3' },
      { id: 4, groupId: 2, name: 'name 3' },
    ],
    field: 'name',
    group: 'groupId',
  };

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    mocks: [
      PopoverController,
    ],
    providers: [
      { provide: NavParams, useValue:  { data: navParams } },
    ],
    imports: [
      TranslocoTestingModule.forRoot({
        langs: { en : {}, es : {} },
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

  const elements = TestElementFinder.configureSpectatorFinder([
    ['group', 'multiple'],
    ['item', 'multiple'],
  ]);

  it('should create', () => {

    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();

  });

  it('should four items', () => {

    spectator.detectChanges();

    const els = elements(spectator);

    expect(els.item.length).toBe(4);

  });

  it('should be two groups', () => {

    spectator.detectChanges();

    const els = elements(spectator);

    expect(els.group.length).toBe(2);

  });

  it('should select option', () => {

    spectator.detectChanges();

    const els = elements(spectator);

    jest.spyOn(spectator.component, 'onSelectOption').mockImplementation(() => Promise.resolve());
    els.item[0].click();

    expect(spectator.component.onSelectOption).toBeCalledTimes(1);
  });

  it('should select option and cansel popover', () => {

    spectator.detectChanges();

    const els = elements(spectator);

    jest.spyOn(spectator.component, 'cancel').mockImplementation(() => Promise.resolve(true));
    els.item[0].click();

    expect(spectator.component.cancel).toBeCalledTimes(1);
  });

  it('should show or hide Item Title ', () => {

    spectator.detectChanges();

    expect(spectator.component.showItemTitle('123', '2')).toBeTruthy();
    expect(spectator.component.showItemTitle('123', '8')).toBeFalsy();
  });
});
