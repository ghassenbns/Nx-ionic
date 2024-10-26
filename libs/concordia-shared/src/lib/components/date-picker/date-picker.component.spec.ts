import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserStateService } from '@concordia-nx-ionic/concordia-core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { UserDatePipe } from '../../pipes';
import { DatePickerComponent as SuT } from '../date-picker/date-picker.component';

const createHost = createHostFactory({
  component: SuT,
  detectChanges: false,
  declarations: [
    UserDatePipe,
  ],
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoTestingModule.forRoot({
      langs: { en: {}, es: {} },
      translocoConfig: {
        availableLangs: ['en', 'es'],
        defaultLang: 'en',
      },
    }),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  mocks: [
    PopoverController,
  ],
  providers: [
    {
      provide: UserStateService,
      useValue: {
        getDateTimeFormat$: jest.fn().mockReturnValue(of('YYYY-MM-DD HH:mm:ss')),
        getTZ$: jest.fn().mockReturnValue(of('UTC')),
        getLocale$: jest.fn().mockReturnValue(of('en')),
      },
    },
  ],
});

describe('DatePickerComponent', () => {
  let spectator: SpectatorHost<SuT>;
  beforeEach(() => {
    spectator = createHost(`<concordia-ng-shared-date-picker>
                            </concordia-ng-shared-date-picker>`, {
      hostProps: {
      },
    });
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
