import { RouterTestingModule } from '@angular/router/testing';
import { TestElementFinder } from '@concordia-nx-ionic/concordia-util';
import { IonicModule } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { SmallCardComponent as SuT } from './small-card.component';

const createHost = createHostFactory({
  component: SuT,
  detectChanges: false,
  imports: [
    IonicModule,
    RouterTestingModule,
    TranslocoTestingModule.forRoot({
      langs: { en: {}, es: {} },
      translocoConfig: {
        availableLangs: ['en', 'es'],
        defaultLang: 'en',
      },
    }),
  ],
});

const data = {
  id: '1',
  name: 'name',
  label: 'label',
  link: 'fleets',
  icon: 'bus-outline',
  icon_color: 'danger',
};

describe('EditItemComponent', () => {

  let spectator: SpectatorHost<SuT>;
  beforeEach(() => {

    spectator = createHost(`<concordia-ng-shared-small-card
                                              [id]="id"
                                              [name]="name"
                                              [label]="label"
                                              [link]="link"
                                              [icon]="icon"
                                              [icon_color]="icon_color"
    ></concordia-ng-shared-small-card>`, {
      hostProps: data,
    });
  });

  const elements = TestElementFinder.configureSpectatorFinder([
    'link',
    'icon',
    'label',
    'labelDetail',
    'name',
    'emptyBlock',
  ]);

  it('should create', () => {

    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();

  });

  it("should be link, icon - name & color, label, name. shouldn't be labelDetail", () => {
    spectator.detectChanges();
    const els = elements(spectator);

    expect((els.link as any).href).toBe(`/${data.link}/${data.id}`);
    expect(els.icon.name).toBe(data.icon);
    expect((els.icon as any).color).toBe(data.icon_color);
    expect(els.label.textContent?.trim()).toBe(data.label);
    expect(els.name.title).toBe(data.name);
    expect(els.labelDetail).toBeNull();
  });

  it("should be link, icon - name & color, label, name. shouldn't be labelDetail", () => {
    spectator.detectChanges();
    const els = elements(spectator);

    expect((els.link as any).href).toBe(`/${data.link}/${data.id}`);
    expect(els.icon.name).toBe(data.icon);
    expect((els.icon as any).color).toBe(data.icon_color);
    expect(els.label.textContent?.trim()).toBe(data.label);
    expect(els.name.title).toBe(data.name);
    expect(els.labelDetail).toBeNull();
  });

  it("shouldn't be link", () => {
    spectator.detectChanges();
    spectator.setInput('link', '');
    spectator.setInput('id', '');

    const els = elements(spectator);
    expect(els.link).toBeNull();
  });

  xit('should be emptyBlock', () => {
    spectator.detectChanges();
    spectator.setInput('name', '');

    const els = elements(spectator);
    expect(els.name).toBeNull();
    expect(els.emptyBlock).toBeTruthy();
  });

  it('should be label detail', () => {
    spectator.detectChanges();
    spectator.setInput('label_detail', '12345');

    const els = elements(spectator);
    expect(els.labelDetail.textContent?.trim()).toBe('12345');
  });
});
