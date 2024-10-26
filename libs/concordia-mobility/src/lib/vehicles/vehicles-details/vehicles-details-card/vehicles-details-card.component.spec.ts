import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { ModelEditDriverComponent } from '../../../drivers/components/model-edit-driver/model-edit-driver.component';
import { MOCK_VEHICLE_DATA } from '../../../mocks';
import { ModalEditVehicleComponent } from '../../components/modal-edit-vehicle/modal-edit-vehicle.component';
import { VehiclesDetailsCardComponent as SuT } from './vehicles-details-card.component';

describe('VehiclesDetailsCardComponent', () => {
  let spectator: SpectatorHost<SuT>;
  const mockVEHICLE = MOCK_VEHICLE_DATA;

  const createHost = createHostFactory({
    template: '',
    component: SuT,
    detectChanges: false,
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
    ],
    entryComponents: [ModelEditDriverComponent],
    providers: [
      {
        provide: ModalController,
        useValue: {
          create: jest.fn().mockReturnValue({
            present: jest.fn(),
            onWillDismiss: jest.fn().mockReturnValue(Promise.resolve({ data: { status: 'ok', data: {} } })),
          }),
        },
      },
    ],
    imports: [
      IonicModule.forRoot(),
      TranslocoTestingModule.forRoot({
        langs: { en : {}, es : {} },
        translocoConfig: {
          availableLangs: ['en', 'es'],
          defaultLang: 'en',
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createHost(`<concordia-nx-ionic-vehicles-details-card [vehicle]="vehicle" [editMode]="editMode">
</concordia-nx-ionic-vehicles-details-card>`,
      {
        hostProps: {
          vehicle: MOCK_VEHICLE_DATA,
          editMode: true,
        },
      },
    );
  });

  it('should create', () => {

    expect(spectator.component)
      .toBeTruthy();
  });

  it('should initialize cardConfig', () => {
    spectator.detectChanges();

    expect(spectator.component.cardConfig).toEqual({
      selector: 'details',
      title: 'details',
      editable: { state: true, mode: 'modal' },
    });
  });

  it('should call onEditModal method and emit submitted event when modal returns data with status "ok"', async () => {
    const modalController = spectator.inject(ModalController);
    const submittedSpy = jest.spyOn(spectator.component.submitted, 'emit');

    await spectator.component.onEditModal({}, mockVEHICLE);

    expect(modalController.create).toHaveBeenCalledWith({
      component: ModalEditVehicleComponent,
      componentProps: { data: mockVEHICLE },
    });
    expect(modalController.create().present).toHaveBeenCalled();

    const modalDismissPromise = modalController.create().onWillDismiss();
    expect(modalDismissPromise).toEqual(Promise.resolve({ data: { status: 'ok', data: {} } }));

    await modalDismissPromise;

    expect(submittedSpy).toHaveBeenCalledWith({});
    expect(submittedSpy).toBeCalledTimes(1);
  });
});
