import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Feature, FEATURES_FIXTURE } from '@concordia-nx-ionic/concordia-mobility-api';
import { TestElementFinder } from '@concordia-nx-ionic/concordia-util';
import { IonicModule } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { FeaturesEditComponent as SuT } from './features-edit.component';

describe('FeaturesEditComponent', () => {

  let spectator: SpectatorHost<SuT>;

  const createHost = createHostFactory({
    template: '',
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    imports: [
      IonicModule,
      FormsModule,
      ReactiveFormsModule,
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
    spectator = createHost(`<concordia-nx-ionic-features-edit
                 [features]="features"
                 [editMode]="editMode "
                 ></concordia-nx-ionic-features-edit>`,
      {
        hostProps: {
          features: [],
          editMode: false,
        },
      },
    );
  });

  const elements = TestElementFinder.configureSpectatorFinder([
    'add',
    ['item', 'multiple'],
    ['delete', 'multiple'],
  ]);

  it('should create', () => {
    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();
  });

  it('should not show item & add button', () => {
    spectator.detectChanges();
    const els = elements(spectator);

    expect(els.add).toBeNull();
    expect(els.item.length).toBe(0);
  });

  it('should show 2 item & add button', () => {
    spectator.setHostInput({ editMode: true, features: FEATURES_FIXTURE });
    spectator.detectChanges();

    const els = elements(spectator);

    expect(els.add).toBeDefined();
    expect(els.item.length).toBe(2);
  });

  it('should emit add', () => {
    spectator.setHostInput({ editMode: true });
    spectator.detectChanges();
    const els = elements(spectator);

    jest.spyOn<EventEmitter<Event>, any>(spectator.component.add, 'emit');
    els.add.click();
    expect(spectator.component.add.emit).toHaveBeenCalled();
  });

  it('should emit delete', () => {
    spectator.setHostInput({ editMode: true, features: FEATURES_FIXTURE });
    spectator.detectChanges();
    const els = elements(spectator);

    jest.spyOn<EventEmitter<Feature>, any>(spectator.component.delete, 'emit');
    els.delete[0].click();
    expect(spectator.component.delete.emit).toHaveBeenCalled();
  });

  it('should emit active', () => {
    spectator.setHostInput({ editMode: true, features: FEATURES_FIXTURE });
    spectator.detectChanges();
    const els = elements(spectator);

    jest.spyOn<EventEmitter<string>, any>(spectator.component.active, 'emit');
    els.item[0].click();
    expect(spectator.component.active.emit).toHaveBeenCalled();
  });
});
