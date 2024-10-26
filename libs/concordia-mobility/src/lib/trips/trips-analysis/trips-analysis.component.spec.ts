import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UiStateService, UserStateService } from '@concordia-nx-ionic/concordia-core';
import { TripsApiServices, VehiclesApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import { AlertService, ENTITY_API_SERVICE, EntityDetailsComponent } from '@concordia-nx-ionic/concordia-shared';
import { IonContent, IonicModule } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { TripsAnalysisComponent as SuT, TripsAnalysisComponent } from './trips-analysis.component';

xdescribe('TripsAnalysisComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    providers: [
      {
        provide: TripsApiServices,
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
        useValue: TripsApiServices,
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
      {
        provide: UiStateService,
        useValue: {
          showRightPanel: jest.fn().mockReturnValue(of( false)),
          showRightMenu: jest.fn().mockReturnValue(of( true)),
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    mocks: [
      IonContent,
      VehiclesApiService,
      UserStateService,
    ],
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
          { path: 'trips', component: TripsAnalysisComponent },
        ],
      ),
      IonicModule.forRoot(),
      EffectsModule.forRoot([]),
      StoreModule.forRoot([]),
    ],
    declarations: [
      EntityDetailsComponent,
      TripsAnalysisComponent,
    ],
  });

  beforeEach(() => {

    spectator = createComponent();

  });

  it('should create', () => {

    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();

  });

});
