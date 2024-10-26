import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { VehicleInterface, VehiclesApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import { ENTITY_API_SERVICE, EntityDetailsComponent } from '@concordia-nx-ionic/concordia-shared';
import { IonContent, IonicModule } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { MOCK_VEHICLE_DATA } from '../../mocks/vehicle';
import { VehiclesDetailsComponent } from './vehicles-details.component';

describe('VehiclesDetailsComponent', () => {
  let spectator: Spectator<VehiclesDetailsComponent>;
  const createComponent = createComponentFactory({
    component: VehiclesDetailsComponent,
    providers: [
      {
        provide: VehiclesApiService,
        useValue: {
          edit: jest.fn(),
          show: jest.fn().mockReturnValue(of({ data: {}, status: 'mock status' })),
        },
      },
      {
        provide: ENTITY_API_SERVICE,
        useValue: VehiclesApiService,
      },
      {
        provide: EntityDetailsComponent,
        useValue: {
          editEntity: jest.fn().mockReturnValue(of({ data: {}, status: 'mock status' })),
        },
      },
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: '123456789' }),
          snapshot: { paramMap: convertToParamMap({ id: '123456789' }) },
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    mocks: [IonContent],
    imports: [
      TranslocoTestingModule.forRoot({
        langs: { en: {}, es: {} },
        translocoConfig: {
          availableLangs: ['en', 'es'],
          defaultLang: 'en',
        },
      }),
      RouterTestingModule.withRoutes(
        [
          { path: 'vehicles', component: VehiclesDetailsComponent },
        ],
      ),
      IonicModule.forRoot(),
      EffectsModule.forRoot([]),
      StoreModule.forRoot([]),
    ],
    declarations: [
      EntityDetailsComponent,
      VehiclesDetailsComponent,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  afterEach(() => {
    jest.spyOn(console, 'error').mockImplementation();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should initialize vehicle$', done => {
    const vehicleMock = MOCK_VEHICLE_DATA;
    jest
      .spyOn(spectator.component, 'getEntityFromQueryId')
      .mockReturnValue(of(vehicleMock));

    spectator.component.ngOnInit();

    spectator.component.vehicle$.subscribe({
      next: value => {
        expect(value).toBe(vehicleMock);
      },
      complete: () => done(),
    });
  });

  it('should disable edit mode', () => {
    const initialEditState = {
      global: false,
      details: false,
      position: false,
    };
    spectator.component.disableEditMode();

    expect(spectator.component.editMode.value).toEqual(initialEditState);
  });

  it('should update vehicle', (done) => {
    const updatedVehicleModel = { _id: 1, name: 'Updated Car' } as VehicleInterface;
    spectator.component.updateVehicle(updatedVehicleModel);

    spectator.component.vehicle$.subscribe({
      next: value => {
        expect(value).toBe(updatedVehicleModel);
      },
      complete: () => done(),
    });

    expect(spectator.component.editMode.value).toEqual({
      global: false,
      details: false,
      position: false,
    });
  });
});
