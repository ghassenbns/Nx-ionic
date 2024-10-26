import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UiStateService } from '@concordia-nx-ionic/concordia-core';
import { TripsApiServices } from '@concordia-nx-ionic/concordia-mobility-api';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { TestElementFinder } from '@concordia-nx-ionic/concordia-util';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { WaypointContainerComponent as SuT } from './waypoint-container.component';

describe('WaypointContainerComponent', () => {

  let spectator: SpectatorHost<SuT>;

  const createHost = createHostFactory({
    component: SuT,
    declarations: [
    ],
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
      UINotificationStateService,
    ],
    providers: [
      {
        provide: TripsApiServices,
        useValue: {
          edit: jest.fn().mockReturnValue(of()),
          show: jest.fn().mockReturnValue(of({ data: {}, status: 'mock status' })),
        },
      },
      {
        provide: UiStateService,
        useValue: {
          showMenu: jest.fn().mockReturnValue(of( false)),
        },
      },
    ],
  });

  beforeEach(() => {

    spectator = createHost(`<concordia-nx-ionic-waypoint-container [_id]="id"
                                    [waypoints]="waypoints">
                                    </concordia-nx-ionic-waypoint-container>`,
        {
          hostProps: {
            id: '1',
            waypoints: {
              type: 'FeatureCollection',
              features: [],
            },
          },
        },
    );

  });

  const elements = TestElementFinder.configureSpectatorFinder([
    'toggleMapBtn',
    'toggleEditModeBtn',
    'canselBtn',
    'submitBtn',
  ]);

  it('should create', () => {

    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();

  });

  it('should hide map', () => {
    spectator.detectChanges();

    const els = elements(spectator);
    els.toggleMapBtn.click();

    expect(spectator.component.editMode).toBeFalsy();
  });

  it('should show edit mode', () => {
    spectator.detectChanges();
    spectator.setInput('editable', true);
    spectator.detectChanges();

    const els = elements(spectator);
    expect(els.toggleEditModeBtn).toBeTruthy();

    els.toggleEditModeBtn.click();

    expect(spectator.component.editMode).toBeTruthy();
    expect(spectator.component.showMap).toBeTruthy();
  });

  it('should hide edit mode', () => {
    spectator.detectChanges();
    spectator.setInput('editable', true);
    spectator.setInput('editMode', true);
    spectator.detectChanges();

    const els = elements(spectator);
    expect(els.canselBtn).toBeTruthy();

    els.canselBtn.click();

    expect(spectator.component.editMode).toBeFalsy();
    expect(spectator.component.showMap).toBeFalsy();
  });

  it('should !!!', () => {
    spectator.detectChanges();
    spectator.setInput('editable', true);
    spectator.setInput('editMode', true);
    spectator.detectChanges();

    const els = elements(spectator);
    expect(els.submitBtn).toBeTruthy();

    els.submitBtn.click();

    // expect(spectator.component.editMode).toBeFalsy();
    // expect(spectator.component.showMap).toBeFalsy();
  });
});
