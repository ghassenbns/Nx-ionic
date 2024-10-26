import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService } from '@concordia-nx-ionic/concordia-core';
import { FleetsApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import { AlertService } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import { createComponentFactory, Spectator, SpyObject } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { LOADING_EVENT, MOCK_FLEET_DATA } from '../../../mocks';
import { FleetsTableComponent as SuT } from './fleets-table.component';

describe('FleetsTableComponent', () => {

  let spectator: Spectator<SuT>;
  let fleetsApiService: SpyObject<FleetsApiService>;

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
        provide: FleetsApiService,
        useValue: {
          edit: jest.fn(),
          status: jest.fn().mockReturnValue(of({ data: [{ _id: '1' }], status: 'mock status' })),
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
    ],
  });

  beforeEach(() => {

    spectator = createComponent();
    fleetsApiService = spectator.inject(FleetsApiService);
    spectator.component.currentEvent = { filters: {} };

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
  });

  it('should should open edit modal with item', () => {

    spectator.detectChanges();

    jest.spyOn(spectator.component, 'onEditModal');
    spectator.component.edit({ _id: '1' });
    expect(spectator.component.onEditModal).toBeCalledTimes(1);
    expect(spectator.component.onEditModal).toBeCalledWith({ _id: '1' });
  });

  it('should should called delete item', () => {

    spectator.detectChanges();

    const spy = jest.spyOn(fleetsApiService, 'deleteMany');
    spectator.component.delete([ { _id: '1' } ] );
    expect(spy).toBeCalledTimes(1);
  });

  it('should should called editMany', () => {

    spectator.detectChanges();

    const spy = jest.spyOn(fleetsApiService, 'editMany');
    spectator.component.changeActive([ MOCK_FLEET_DATA ], false );
    expect(spy).toBeCalledTimes(1);
  });

  it('should should show console log', () => {

    spectator.detectChanges();

    const spy = jest.spyOn(console, 'log').mockImplementation();
    spectator.component.info();
    expect(spy).toBeCalledTimes(1);
  });

  it('should should show console log', () => {

    spectator.detectChanges();

    spectator.component.loadEvent(LOADING_EVENT);
    expect(spectator.component.currentEvent).toBe(LOADING_EVENT);
  });
});
