import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { MOCK_DRIVER_DATA } from '../../../mocks/driver';
import { ModelEditDriverComponent } from '../../components/model-edit-driver/model-edit-driver.component';
import { DriversDetailsCardComponent } from './details-card.component';

describe('DetailsCardComponent', () => {
  let spectator: Spectator<DriversDetailsCardComponent>;
  const mockDriver = MOCK_DRIVER_DATA;
  const createComponent = createComponentFactory({
    component: DriversDetailsCardComponent,
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
    entryComponents: [ModelEditDriverComponent],
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
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props :{
        driver : mockDriver,
        // editMode : {global : false, details : false},
        isLoading : false,
      },
    });
  });

  afterEach(() => {
    jest.spyOn(console, 'error').mockImplementation();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should initialize cardConfig', () => {
    expect(spectator.component.cardConfig).toEqual({
      selector: 'details',
      title: 'details',
      editable: { state: true, mode: 'modal' },
    });
  });

  it('should call onEditModal method and emit submitted event when modal returns data with status "ok"', async () => {
    const modalController = spectator.inject(ModalController);
    const submittedSpy = jest.spyOn(spectator.component.submitted, 'emit');

    await spectator.component.onEditModal({}, mockDriver);

    expect(modalController.create).toHaveBeenCalledWith({
      component: ModelEditDriverComponent,
      componentProps: { data: mockDriver },
    });
    expect(modalController.create().present).toHaveBeenCalled();

    const modalDismissPromise = modalController.create().onWillDismiss();
    expect(modalDismissPromise).toEqual(Promise.resolve({ data: { status: 'ok', data: {} } }));

    await modalDismissPromise;

    expect(submittedSpy).toHaveBeenCalledWith({});
  });
});
