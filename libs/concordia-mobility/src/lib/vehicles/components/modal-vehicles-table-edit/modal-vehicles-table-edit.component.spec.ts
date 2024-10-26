import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import { FleetDataInterface } from '@concordia-nx-ionic/concordia-mobility-api';
import {
  HttpResponseListType,
  Strategy,
} from '@concordia-nx-ionic/concordia-shared';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { MOCK_FLEET_DATA } from '../../../mocks/fleet';
import { ModalVehiclesTableEditComponent } from './modal-vehicles-table-edit.component';

describe('ModalVehiclesTableEditComponent', () => {
  let spectator: Spectator<ModalVehiclesTableEditComponent>;
  const mockStrategy = {
    name: 'vehicle',
    entity: 'vehicle',
    columns: [
      {
        field: 'name',
        contentType: 'string',
        rowSelector: 'name',
        required: true,
        searchType: 'text',
        filterType: 'string',
        options: [],
      },
    ],
    actions: [],
    multiActions: [],
  } as Strategy;

  const createComponent = createComponentFactory({
    component: ModalVehiclesTableEditComponent,
    imports: [
      HttpClientTestingModule,
      IonicModule.forRoot(),
      EffectsModule.forRoot([]),
      StoreModule.forRoot([]),
    ],
    providers: [
      {
        provide: ConfigService,
        useValue: {
          getEnvironment: () => ({
            config: { apiUrl: 'http://localhost:4300' },
          }),
        },
      },
      mockProvider(NavParams),
      mockProvider(ModalController),
      {
        provide: TranslocoService,
        useValue: { translate: jest.fn() },
      },
    ],
    detectChanges: false,
    shallow: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    jest.spyOn(console, 'error').mockImplementation();

  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  xit('should initialize the component', () => {
    const mockListResponse: Observable<
      HttpResponseListType<FleetDataInterface>
    > = of({
      status: 'test',
      data: [MOCK_FLEET_DATA],
    });

    const mockNavParams = {
      data: [MOCK_FLEET_DATA],
    };
    spectator.component['navParams'].data = mockNavParams;

    jest
      .spyOn(spectator.component['fleetsApiService'], 'list')
      .mockReturnValue(mockListResponse);
    spectator.component.ngOnInit();

    expect(spectator.component.selectedData.data[0].name).toEqual('Fleet TEST');
  });

  it('should handle delete action', () => {
    spectator.component.selectedData = {
      data: [
        {
          _id: '1',
          name: 'Vehicle 1',
          status: 'edit',
          toBeDeleted: false,
          changed: false,
        },
        {
          _id: '2',
          name: 'Vehicle 2',
          status: 'edit',
          toBeDeleted: false,
          changed: false,
        },
      ],
    };

    spectator.component.delete(spectator.component.selectedData.data[0]);

    expect(spectator.component.selectedData.data[0].toBeDeleted).toBe(true);
    expect(spectator.component.selectedData.data[0].changed).toBe(true);
  });

  it('should handle duplicate action', () => {
    spectator.component.selectedData = {
      data: [
        {
          _id: '1',
          name: 'Vehicle 1',
          status: 'edit',
          toBeDeleted: false,
          changed: false,
        },
      ],
    };

    spectator.component.duplicate(spectator.component.selectedData.data[0]);

    expect(spectator.component.selectedData.data.length).toBe(2);
    // expect(spectator.component.selectedData.data[1].name).toEqual(
    //   'Vehicle 1_copy',
    // );
    expect(spectator.component.selectedData.data[1].status).toEqual('new');
    expect(spectator.component.selectedData.data[1].changed).toBe(true);
  });

  it('should handle cancel action', () => {
    spectator.component.selectedData = {
      data: [
        {
          _id: '1',
          name: 'Vehicle 1',
          uuid: '123',
          status: 'edit',
          toBeDeleted: false,
          changed: false,
        },
        {
          _id: '2',
          name: 'Vehicle 2',
          uuid: '456',
          status: 'edit',
          toBeDeleted: false,
          changed: false,
        },
      ],
    };
    spectator.component.currentData = spectator.component.selectedData.data;

    spectator.component.cancel('123');

    expect(spectator.component.selectedData.data[0]).toEqual({
      _id: '1',
      name: 'Vehicle 1',
      uuid: '123',
      status: 'edit',
      toBeDeleted: false,
      changed: false,
    });
    expect(spectator.component.selectedData.data[1]).toEqual({
      _id: '2',
      name: 'Vehicle 2',
      uuid: '456',
      status: 'edit',
      toBeDeleted: false,
      changed: false,
    });

    spectator.component.cancel('789');

    expect(spectator.component.selectedData.data[0]).toEqual({
      _id: '1',
      name: 'Vehicle 1',
      uuid: '123',
      status: 'edit',
      toBeDeleted: false,
      changed: false,
    });
    expect(spectator.component.selectedData.data[1]).toEqual({
      _id: '2',
      name: 'Vehicle 2',
      uuid: '456',
      status: 'edit',
      toBeDeleted: false,
      changed: false,
    });
  });

  it('should handle add action', () => {
    spectator.component.strategy = mockStrategy;
    spectator.component.selectedData = {
      data: [
        {
          _id: '1',
          name: 'Vehicle 1',
          status: 'edit',
          toBeDeleted: false,
          changed: false,
        },
      ],
    };

    spectator.component.add();

    expect(spectator.component.selectedData.data.length).toBe(2);
  });

  //TODO : Implement 'Should save fleet' case once new saving logic is implemented
});
