import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator/jest';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, Subject } from 'rxjs';

import { RouterActions } from '../actions/index';
import { RouterEffects as SuT } from './router.effects';

describe('RouterEffects', () => {

  let router: SpyObject<Router>;
  let location: SpyObject<Location>;

  let effects: SuT;
  let actions$: Subject<any>;
  let subscribe: jest.Mock<any>;

  let spectator: SpectatorService<SuT>;

  const createService = createServiceFactory({
    service: SuT,
    providers: [
      provideMockActions(() => actions$),
    ],
    mocks: [
      Router,
      Location,
    ],
  });

  beforeEach(() => {

    spectator = createService();

    effects = spectator.inject(SuT);
    actions$ = new ReplaySubject(1);
    subscribe = jest.fn();

    location = spectator.inject(Location);
    router = spectator.inject(Router);

  });

  it('should handle navigate by url', () => {

    effects.handleNavigateByUrl$.subscribe();

    actions$.next(
      RouterActions.navigateByUrl({
        url: '/test',
        extras: {
          skipLocationChange: true,
        },
      }),
    );

    expect(router.navigateByUrl).toHaveBeenCalledWith('/test', {
      skipLocationChange: true,
      replaceUrl: true,
    });

  });

  it('should handle navigate', () => {

    effects.handleNavigate$.subscribe(subscribe);

    actions$.next(
      RouterActions.navigate({
        path: ['/test'],
        query: {
          test: 'true',
        },
        extras: {
          skipLocationChange: true,
        },
      }),
    );

    expect(router.navigate).toHaveBeenCalledWith(['/test'], {
      queryParams: {
        test: 'true',
      },
      replaceUrl: true,
      skipLocationChange: true,
    });

  });

  it('should handle back', () => {

    effects.handleBack$.subscribe(subscribe);

    actions$.next(
      RouterActions.back(),
    );

    expect(location.back).toHaveBeenCalled();

  });

  it('should handle forward', () => {

    effects.handleForward$.subscribe(subscribe);

    actions$.next(
      RouterActions.forward(),
    );

    expect(location.forward).toHaveBeenCalled();

  });

});
