import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestElementFinder } from '@concordia-nx-ionic/concordia-util';
import { IonicModule } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';

import { CardAccordionComponent as SuT } from './card-accordion.component';

const createHost = createHostFactory({
  component: SuT,
  detectChanges: false,
  imports: [
    IonicModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
});

describe('EditItemComponent', () => {
  let spectator: SpectatorHost<SuT>;
  beforeEach(() => {
    spectator = createHost(`<concordia-ng-shared-card-accordion [header]="header">
                            </concordia-ng-shared-card-accordion>`, {
      hostProps: {
        header: 'header',
      },
    });
  });

  const elements = TestElementFinder.configureSpectatorFinder([
    'header',
    'openBtn',
    'content',
  ]);

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it('should be new header', () => {
    spectator.detectChanges();

    const els = elements(spectator);
    expect(els.header).toContainText('header');
  });

  it('should be hide content', () => {
    spectator.detectChanges();

    const els = elements(spectator);
    expect(spectator.component.isOpen).toBeFalsy();
    expect(els.content).toBeNull();
  });

  it('should be show content', () => {
    spectator.detectChanges();

    const els = elements(spectator);
    els.openBtn.click();

    expect(spectator.component.isOpen).toBeTruthy();
  });
});
