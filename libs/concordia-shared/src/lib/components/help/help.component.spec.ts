import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UiStateService } from '@concordia-nx-ionic/concordia-core';
import { IonicModule } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';

import { HelpComponent as SuT } from './help.component';

const createHost = createHostFactory({
  component: SuT,
  detectChanges: false,
  imports: [
    IonicModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  mocks: [
    UiStateService,
  ],
});

describe('HelpComponent', () => {
  let spectator: SpectatorHost<SuT>;
  beforeEach(() => {
    spectator = createHost(`<concordia-ng-shared-help [page]="page">
                            </concordia-ng-shared-help>`, {
      hostProps: {
        page: 'page',
      },
    });
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
