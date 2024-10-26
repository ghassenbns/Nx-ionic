import { IonicModule } from '@ionic/angular';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { AlertService as SuT } from './alert.service';

describe('AlertService', () => {

  let spectator: SpectatorService<SuT>;
  let sut: SuT;

  const createService = createServiceFactory({
    service: SuT,
    mocks: [
      Store,
    ],
    imports: [
      IonicModule,
      TranslocoTestingModule.forRoot({
        langs: { en: {}, es: {} },
        translocoConfig: {
          availableLangs: ['en', 'es'],
          defaultLang: 'en',
        },
      }),
    ],
  });

  beforeEach(() => {

    spectator = createService();

    sut = spectator.inject(SuT);

  });

  it('should create', () => {

    expect(sut).toBeTruthy();

  });

});
