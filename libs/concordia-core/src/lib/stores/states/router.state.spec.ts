import { NavigationExtras, Params } from '@angular/router';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';

import { RouterActions } from '../actions';
import { RouterStateService as SuT } from './router.state';

describe('RouterStateService', () => {

  let store: SpyObject<Store<any>>;

  let spectator: SpectatorService<SuT>;
  let sut: SuT;

  const createService = createServiceFactory({
    service: SuT,
    mocks: [
      Store,
    ],
  });

  beforeEach(() => {

    spectator = createService();

    sut = spectator.inject(SuT);

    store = spectator.inject(Store);

  });

  it('should navigate', () => {

    const path: any[] = ['/test'];
    const query: Params = { test: 'test' };
    const extras: NavigationExtras = { skipLocationChange: true };

    sut.navigate(path, query, extras);

    expect(store.dispatch)
      .toHaveBeenCalledWith(
        RouterActions.navigate({ path, query, extras }),
      );

  });

  it('should navigate by url', () => {

    const url = '/test';
    const extras: NavigationExtras = { skipLocationChange: true };

    sut.navigateByUrl(url, extras);

    expect(store.dispatch)
      .toHaveBeenCalledWith(
        RouterActions.navigateByUrl({ url, extras }),
      );

  });

});
