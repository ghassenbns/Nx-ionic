import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService } from '@concordia-nx-ionic/concordia-core';
import { VehiclesApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import { AlertService } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { SignalsTableComponent as SuT  } from './signals-table.component';

describe('SignalsTableComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    imports: [
      TranslocoTestingModule.forRoot({
        langs: { en: {}, es: {} },
        translocoConfig: {
          availableLangs: ['en', 'es'],
          defaultLang: 'en',
        },
      }),
    ],
    mocks: [
      ActivatedRoute,
      Router,
      AlertService,
      UINotificationStateService,
      AppStateService,
      ModalController,
      VehiclesApiService,
    ],
  });

  beforeEach(() => {

    spectator = createComponent();

  });

  it('should create', () => {

    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();

  });

  it('should should open edit modal without item', () => {

    spectator.detectChanges();

    jest.spyOn(spectator.component, 'onEditModal');
    spectator.component.add();

    expect(spectator.component.onEditModal).toBeCalledTimes(1);
    expect(spectator.component.onEditModal).toBeCalledWith();

  });

  it('should should open edit modal with item', () => {

    spectator.detectChanges();

    jest.spyOn(spectator.component, 'onEditModal');
    spectator.component.edit({} as any);

    expect(spectator.component.onEditModal).toBeCalledTimes(1);
    expect(spectator.component.onEditModal).toBeCalledWith({});

  });

  it('should open multi edit modal ', () => {

    spectator.detectChanges();

    jest.spyOn(spectator.component, 'openEditModal');
    spectator.component.multiEdit([{} as any]);

    expect(spectator.component.openEditModal).toBeCalledTimes(1);
    expect(spectator.component.openEditModal).toBeCalledWith([{}]);

  });
});
