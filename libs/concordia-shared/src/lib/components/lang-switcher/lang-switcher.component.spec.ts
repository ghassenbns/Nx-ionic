import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { LangSwitcherComponent as SuT } from './lang-switcher.component';

describe('LangSwitcherComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    imports: [
    ],
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

  it('should emit change language event', () => {
    const emitSpy = jest.spyOn(spectator.component.update, 'emit');
    spectator.component.changeLanguage({ detail: { value: 'en' } });
    expect(emitSpy).toHaveBeenCalled();
  });
});
