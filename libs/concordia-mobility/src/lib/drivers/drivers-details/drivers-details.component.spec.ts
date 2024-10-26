import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DriverDataInterface, DriversApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import { AlertService, EntityDetailsComponent } from '@concordia-nx-ionic/concordia-shared';
import { ENTITY_API_SERVICE } from '@concordia-nx-ionic/concordia-shared';
import { IonContent, IonicModule } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { lastValueFrom, of } from 'rxjs';

import { DriversDetailsComponent } from './drivers-details.component';

describe('DriversDetailsComponent', () => {
  let spectator: Spectator<DriversDetailsComponent>;
  const createComponent = createComponentFactory({
    component: DriversDetailsComponent,
    providers: [
      {
        provide: DriversApiService,
        useValue: {
          edit: jest.fn(),
          show: jest.fn().mockReturnValue(of({ data: {}, status: 'mock status' })),
        },
      },
      {
        provide: AlertService,
        useValue: {
          showDefault: jest.fn(),
        },
      },
      {
        provide: ENTITY_API_SERVICE,
        useValue: DriversApiService,
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
          { path: 'drivers', component: DriversDetailsComponent },
        ],
      ),
      IonicModule.forRoot(),
      EffectsModule.forRoot([]),
      StoreModule.forRoot([]),
    ],
    declarations: [
      EntityDetailsComponent,
      DriversDetailsComponent,
    ],

  });

  beforeEach(() => {
    spectator = createComponent();
  });

  afterEach(() => {
    jest.spyOn(console, 'error').mockImplementation();
    jest.clearAllMocks();
  });

  it('should disable edit mode', () => {
    spectator.component.disableEditMode();

    expect(spectator.component.editMode.value).toEqual({
      global: false,
      details: false,
      position: false,
    });
  });

  it('should update driver', async() => {
    const updatedDriver = { _id: '123', name: 'TEST 2' } as DriverDataInterface;
    spectator.component.updateDriver(updatedDriver);
    expect(await lastValueFrom(spectator.component.driver$)).toBe(updatedDriver);
  });

});
