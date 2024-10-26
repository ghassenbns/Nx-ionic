import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService } from '@concordia-nx-ionic/concordia-core';
import {
  FleetsApiService,
  VehicleInterface,
  VehiclesApiService,
} from '@concordia-nx-ionic/concordia-mobility-api';
import {
AlertService,
HttpRecordType,
} from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import {
createComponentFactory,
mockProvider,
Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';
import { of } from 'rxjs';

import { ModalEditVehicleComponent } from '../modal-edit-vehicle/modal-edit-vehicle.component';
import { VehiclesTableComponent } from './vehicles-table.component';

describe('VehiclesTableComponent', () => {
  let spectator: Spectator<VehiclesTableComponent>;
  const mockVehiclesTypesResponse = [
    {
      status: 'test',
      data: [{ vehicleTypeId: 1, type: 'TEST_TYPE', label: 'TEST_LABEL' }],
    },
  ];
  const mockFuelTypes = [
    {
      status: 'test',
      data: [{ vehicleFuelTypeId: 1, type: 'TEST_TYPE', label: 'TEST_LABEL' }],
    },
  ];

  const createComponent = createComponentFactory({
    component: VehiclesTableComponent,
    providers: [
      mockProvider(ActivatedRoute),
      mockProvider(Router),
      mockProvider(AppStateService),
      mockProvider(AlertService),
      mockProvider(TranslocoService),
      mockProvider(UINotificationStateService),
      mockProvider(VehiclesApiService, {
        listType: () => of(mockVehiclesTypesResponse),
        listFuelType: ()=> of(mockFuelTypes),
      }),
      mockProvider(FleetsApiService, {
        list: () => of([]),
      }),
      mockProvider(ChangeDetectorRef),
      mockProvider(ModalController),
    ],
    detectChanges: false,
    shallow: true,
    schemas: [NO_ERRORS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should handle add action', async () => {
    const mock = {
      present: jest.fn(),
      onWillDismiss: jest.fn().mockResolvedValue({}),
    } as unknown;
    const mockModalCtrl = spectator.inject(ModalController);
    jest
      .spyOn(mockModalCtrl, 'create')
      .mockResolvedValue(mock as Promise<HTMLIonModalElement>);

    spectator.component.add();

    expect(mockModalCtrl.create).toHaveBeenCalledWith({
      component: ModalEditVehicleComponent,
    });
  });

  it('should change the active status of vehicles', () => {
    const mockRows: VehicleInterface[] = [
      {
        _id: '1',
        name: 'Vehicle 1',
        isActive: true,
      },
      {
        _id: '2',
        name: 'Vehicle 2',
        isActive: false,
      },
    ] as VehicleInterface[];
    const mockParams = [
      { _id: '1', isActive: false },
      { _id: '2', isActive: false },
    ];
    const mockVehiclesApiService = spectator.inject(VehiclesApiService);
    const mockRecord = { status: 'test', data: null } as unknown;
    jest
      .spyOn(mockVehiclesApiService, 'editMany')
      .mockReturnValue(of(mockRecord as HttpRecordType<VehicleInterface>));
    const mockLoadEvent = jest.spyOn(spectator.component, 'loadEvent');

    spectator.component.changeActive(mockRows, false);

    expect(mockVehiclesApiService.editMany).toHaveBeenCalledWith(mockParams);
    expect(mockLoadEvent).toHaveBeenCalled();
  });

});
