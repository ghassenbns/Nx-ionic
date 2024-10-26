import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FleetsApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import { EntityDetailsComponent } from '@concordia-nx-ionic/concordia-shared';
import { IonContent, IonicModule } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { FleetsDetailsComponent, FleetsDetailsComponent as SuT } from './fleets-details.component';

describe('FleetsDetailsComponent', () => {

  let spectator: Spectator<SuT>;

  const createComponent = createComponentFactory({
    component: SuT,
    detectChanges: false,
    providers: [
      {
        provide: FleetsApiService,
        useValue: {
          edit: jest.fn(),
          show: jest.fn().mockReturnValue(of({ data: {}, status: 'mock status' })),
        },
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
          { path: 'fleet', component: FleetsDetailsComponent },
        ],
      ),
      IonicModule.forRoot(),
      EffectsModule.forRoot([]),
      StoreModule.forRoot([]),
    ],
    declarations: [
      EntityDetailsComponent,
      FleetsDetailsComponent,
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
