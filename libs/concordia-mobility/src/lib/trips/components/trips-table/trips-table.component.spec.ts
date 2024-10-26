import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService } from '@concordia-nx-ionic/concordia-core';
import { FleetsApiService, TripsApiServices } from '@concordia-nx-ionic/concordia-mobility-api';
import { AlertService, MultiActionEnum } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import { createComponentFactory, Spectator, SpyObject } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { MOCK_TRIP_DATA } from '../../../mocks/trip';
import { TripsTableComponent as SuT } from './trips-table.component';

describe('TripsTableComponent', () => {

  let spectator: Spectator<SuT>;
  let tripsApiServices: SpyObject<TripsApiServices>;

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
          list: jest.fn().mockReturnValue(of({ data: [{ _id: '1' }], status: 'mock status' })),
        },
      },
      {
        provide: TripsApiServices,
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
          setStatusAccept: jest.fn().mockReturnValue(of({ data: [{ _id: '1' }], status: 'mock status' })),
          setStatusProgress: jest.fn().mockReturnValue(of({ data: [{ _id: '1' }], status: 'mock status' })),
          setStatusComplete: jest.fn().mockReturnValue(of({ data: [{ _id: '1' }], status: 'mock status' })),
          deleteMany: jest.fn().mockReturnValue(of({ data: [{ _id: '1' }], status: 'mock status' })),
        },
      },
    ],
  });

  beforeEach(() => {

    spectator = createComponent();
    tripsApiServices = spectator.inject(TripsApiServices);
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
    expect(spectator.component.onEditModal).toBeCalledWith(null);
  });

  it('should should open edit modal with item', () => {

    spectator.detectChanges();

    jest.spyOn(spectator.component, 'onEditModal');
    spectator.component.edit({ _id: '1' });
    expect(spectator.component.onEditModal).toBeCalledTimes(1);
    expect(spectator.component.onEditModal).toBeCalledWith({ _id: '1' });
  });

  it('should should open duplicate modal with item', () => {

    spectator.detectChanges();

    jest.spyOn(spectator.component, 'onCloneModal');
    spectator.component.duplicate({ _id: '1' });
    expect(spectator.component.onCloneModal).toBeCalledTimes(1);
    expect(spectator.component.onCloneModal).toBeCalledWith({ _id: '1' });
  });

  it('should should set Status Accept', () => {

    spectator.detectChanges();

    const setStatusAccept = jest.spyOn(tripsApiServices, 'setStatusAccept');

    spectator.component.multiActionEvent({ type: MultiActionEnum.SET_STATUS_ACCEPTED, rows: [ { _id: '1' } ] } );
    expect(setStatusAccept).toBeCalledTimes(1);
    expect(setStatusAccept).toBeCalledWith([{ _id: '1' }]);
  });

  it('should should set Status Progress', () => {

    spectator.detectChanges();

    const setStatusProgress = jest.spyOn(tripsApiServices, 'setStatusProgress');
    spectator.component.multiActionEvent({ type: MultiActionEnum.SET_STATUS_PROGRESS, rows: [ { _id: '1' } ] } );
    expect(setStatusProgress).toBeCalledTimes(1);
    expect(setStatusProgress).toBeCalledWith([{ _id: '1' }]);
  });

  it('should should set Status Completed', () => {

    spectator.detectChanges();

    const setStatusComplete = jest.spyOn(tripsApiServices, 'setStatusComplete');
    spectator.component.multiActionEvent({ type: MultiActionEnum.SET_STATUS_COMPLETED, rows: [ { _id: '1' } ] } );
    expect(setStatusComplete).toBeCalledTimes(1);
    expect(setStatusComplete).toBeCalledWith([{ _id: '1' }]);
  });

  it('should should show alert', () => {

    spectator.detectChanges();

    const spy = jest.spyOn(spectator.component, 'presentDeleteAlert');
    spectator.component.multiActionEvent({ type: MultiActionEnum.DELETE, rows: [ MOCK_TRIP_DATA ] } );
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith([MOCK_TRIP_DATA.name], [{ _id: MOCK_TRIP_DATA._id } ]);
  });

  it('should should be throw: Error: Invalid action type', () => {

    spectator.detectChanges();

    expect(() => {
      spectator.component.multiActionEvent({ type: MultiActionEnum.ACTIVATE, rows: [ { _id: '1' } ] } );
    }).toThrow();
  });

  it('should should called delete item', () => {

    spectator.detectChanges();

    const deleteMany = jest.spyOn(tripsApiServices, 'deleteMany');
    spectator.component.delete([ { _id: '1' } ] );
    expect(deleteMany).toBeCalledTimes(1);
  });

  it('should should show console log', () => {

    spectator.detectChanges();

    const spy = jest.spyOn(console, 'log').mockImplementation();
    spectator.component.info([ { _id: '1' } ] );
    expect(spy).toBeCalledTimes(1);
  });

  it('should should show console error', () => {

    spectator.detectChanges();

    const spy = jest.spyOn(console, 'error').mockImplementation();
    spectator.component.changeActive([ MOCK_TRIP_DATA ], false );
    expect(spy).toBeCalledTimes(1);
  });
});
