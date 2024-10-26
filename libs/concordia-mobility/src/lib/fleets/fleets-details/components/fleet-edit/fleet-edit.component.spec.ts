import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FleetsApiService, RelatedUsersApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { TestElementFinder } from '@concordia-nx-ionic/concordia-util';
import { IonicModule } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { MOCK_FLEET_DATA } from '../../../../mocks';
import { FleetEditComponent as SuT } from './fleet-edit.component';

describe('FleetEditComponent', () => {

  let spectator: SpectatorHost<SuT>;

  const createHost = createHostFactory({
    template: '',
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    imports: [
      IonicModule,
      FormsModule,
      ReactiveFormsModule,
      TranslocoTestingModule.forRoot({
        langs: { en : {}, es : {} },
        translocoConfig: {
          availableLangs: ['en', 'es'],
          defaultLang: 'en',
        },
      }),
    ],
    providers: [
      {
        provide: RelatedUsersApiService,
        useValue: {
          listOwners: jest.fn().mockReturnValue(of([])),
          listManagersByFleet: jest.fn().mockReturnValue(of([])),
        },
      },
      {
        provide: FleetsApiService,
        useValue: {
          edit: jest.fn().mockReturnValue(of({})),
        },
      },
      {
        provide: UINotificationStateService,
        useValue: {
          error: jest.fn().mockReturnValue(of({})),
        },
      },
  ],
  });

  beforeEach(() => {
    spectator = createHost(`<concordia-nx-ionic-fleet-edit
                 [fleet]="fleet"
                 ></concordia-nx-ionic-fleet-edit>`,
      {
        hostProps: {
          fleet: MOCK_FLEET_DATA,
        },
      },
    );
  });

  const elements = TestElementFinder.configureSpectatorFinder([
    'edit',
    'save',
    'cansel',
    'fleetName',
    'fleetDescription',
    'fleetOwnerName',
    'fleetManagersNames',
    'fleetNameControl',
  ]);

  it('should create', () => {
    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();
  });

  it('should read mode, show - edit button, hide - cansel & save buttons', () => {
    spectator.detectChanges();

    const els = elements(spectator);

    expect(els.edit).toBeTruthy();
    expect(els.save).toBeNull();
    expect(els.cansel).toBeNull();
    expect(spectator.component.editMode).not.toBeTruthy();
    expect(els.fleetName.title).toBe(MOCK_FLEET_DATA.name);
    expect(els.fleetDescription.title).toBe(MOCK_FLEET_DATA.description);
    expect(els.fleetOwnerName.title).toBe(MOCK_FLEET_DATA.ownerDetails.name);
    expect(els.fleetManagersNames.title).toBe(MOCK_FLEET_DATA.managersDetails.map(i => i.name).join(', '));

    jest.spyOn(spectator.component, 'toggleEditMode');
    els.edit.click();
    expect(spectator.component.toggleEditMode).toBeCalledTimes(1);
    expect(spectator.component.editMode).toBeTruthy();
  });

  it('should be edit mode, show - cansel & save button, hide - edit button' +
    ' and after click cansel button, should be show - edit button, hide - cansel & save button', () => {
    spectator.component.editMode = true;
    spectator.detectChanges();

    let els = elements(spectator);

    expect(els.edit).toBeNull();
    expect(els.save).toBeDefined();
    expect(els.cansel).toBeDefined();

    jest.spyOn(spectator.component, 'onCancel');
    els.cansel.click();

    spectator.detectChanges();
    els = elements(spectator);

    expect(spectator.component.onCancel).toBeCalledTimes(1);
    expect(spectator.component.editMode).not.toBeTruthy();
    expect(els.edit).toBeDefined();
    expect(els.save).toBeNull();
    expect(els.cansel).toBeNull();
  });

});
