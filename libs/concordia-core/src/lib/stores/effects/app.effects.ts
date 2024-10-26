import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AuthApiService, UserApiService } from '@concordia-nx-ionic/concordia-auth-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { getParam } from '../../utils';
import { AppActions, RouterActions, UserActions, VersionActions } from '../actions';

@Injectable()
export class AppEffects {

  handleBoot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AppActions.boot,
      ),
      switchMap(() => {
        return of(this.auth.getUserToken()).pipe(
          switchMap(token => {
            const url = this.document.location.pathname;
            const search = this.document.location.search;
            const endUrl = new URLSearchParams(search).get('endUrl')?.split('?');
            const info = this.authApiService.getUserTokenInfo();
            const actions = [];

            actions.push(AppActions.bootSuccess(info));

            if (token) {
              if (url.startsWith('/auth')) {
                actions.push(RouterActions.navigate({
                  path: endUrl && !endUrl[0].startsWith('/auth') ? [endUrl[0]] : ['landing', 'list'],
                  ...endUrl && {
                    query: getParam(endUrl[1]),
                  },
                }));
              } else {
                actions.push(RouterActions.navigate({
                  path: [url],
                  query: getParam(search.split('?')[1]),
                }));
              }

              actions.push(UserActions.loadUser());
            }

            return [
              ...actions,
            ];
          }),
          catchError(err => {
            return of(AppActions.bootFailure({ err }));
          }),
        );
      }),
    ),
  );

  handleBootSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AppActions.bootSuccess,
      ),
      switchMap(info => {
        return [
          AppActions.setTokenInfo({ scopes: info.scopes, sub: info.sub }),
          VersionActions.loadVersion(),
        ];
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly auth: AuthApiService,
    private readonly authApiService: AuthApiService,
    private readonly userApiService: UserApiService,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
  }

}
