import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService } from '@concordia-nx-ionic/concordia-core';
import { DriversApiService, FleetsApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import { AlertService } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import { createComponentFactory, Spectator, SpyObject } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { MOCK_DRIVER_DATA } from '../../../mocks';
import { DriversTableComponent as SuT } from './drivers-table.component';

describe('DriversTableComponent', () => {

  let spectator: Spectator<SuT>;
  let driversApiService: SpyObject<DriversApiService>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    mocks: [
      ActivatedRoute,
      Router,
      UINotificationStateService,
      ModalController,
      AlertService,
      AppStateService,
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
    providers: [
      {
        provide: DriversApiService,
        useValue: {
          records: jest.fn().mockReturnValue(of(
            { data: [{ _id: '1' }],
              pagination: {
                currentPage: 1,
                from: 1,
                lastPage: 2,
                perPage: 10,
                prevPageUrl: null,
                to: 11,
                total: 20,
              },
              status: 'mock status' })),
          deleteMany: jest.fn().mockReturnValue(of({ data: [{ _id: '1' }], status: 'mock status' })),
          editMany: jest.fn().mockReturnValue(of({ data: [{ _id: '1' }], status: 'mock status' })),
        },
      },
      {
        provide: FleetsApiService,
        useValue: {
          list: jest.fn().mockReturnValue(of({ data: [{ _id: '1' }], status: 'mock status' })),
        },
      },
    ],
  });

  beforeEach(() => {

    spectator = createComponent();
    driversApiService = spectator.inject(DriversApiService);
    spectator.component.currentEvent = { filters: {} };

  });

  it('should create', () => {

    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();

  });

  it('should should show console log', () => {

    spectator.detectChanges();

    const spy = jest.spyOn(console, 'log').mockImplementation();
    spectator.component.info([ { _id: '1' } ] );
    expect(spy).toBeCalledTimes(1);
  });

  it('should should open edit modal without item', () => {

    spectator.detectChanges();

    jest.spyOn(spectator.component, 'onEditModal');
    spectator.component.add();
    expect(spectator.component.onEditModal).toBeCalledTimes(1);
    expect(spectator.component.onEditModal).toBeCalledWith(null);
  });

  it('should should open edit modal with item', () => {

    spectator.detectChanges();

    jest.spyOn(spectator.component, 'onEditModal');
    spectator.component.edit({ _id: '1' });
    expect(spectator.component.onEditModal).toBeCalledTimes(1);
    expect(spectator.component.onEditModal).toBeCalledWith({ _id: '1' });
  });

  it('should should open edit modal with item', () => {

    spectator.detectChanges();

    jest.spyOn(spectator.component, 'openEditModal');
    spectator.component.multiEdit([MOCK_DRIVER_DATA]);
    expect(spectator.component.openEditModal).toBeCalledTimes(1);
    expect(spectator.component.openEditModal).toBeCalledWith([MOCK_DRIVER_DATA]);
  });

  it('should should called delete item', () => {

    spectator.detectChanges();

    const deleteMany = jest.spyOn(driversApiService, 'deleteMany');
    spectator.component.delete([ { _id: '1' } ] );
    expect(deleteMany).toBeCalledTimes(1);
  });

  it('should should called delete item', () => {

    spectator.detectChanges();

    const editMany = jest.spyOn(driversApiService, 'editMany');
    spectator.component.changeActive([ MOCK_DRIVER_DATA ], false );
    expect(editMany).toBeCalledTimes(1);
  });
});
