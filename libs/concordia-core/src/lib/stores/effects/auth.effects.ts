import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthApiService, LoginResponseData } from '@concordia-nx-ionic/concordia-auth-api';
import { NotificationActions } from '@concordia-nx-ionic/concordia-ui';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  catchError,
  switchMap,
} from 'rxjs/operators';

import { getParam } from '../../utils';
import { AppActions, RouterActions, VersionActions } from '../actions';
import * as AuthActions from '../actions/auth.actions';
import * as UserActions from '../actions/user.actions';
import { AppStateService } from '../states';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => this.actions$.pipe(
      ofType(
        AuthActions.login,
      ),
      switchMap(action =>
        this.authApiService.login(action.username, action.password).pipe(
          switchMap(response => {
            const endUrl = this.route.snapshot.queryParams['endUrl']?.split('?');
            const info = this.authApiService.getUserTokenInfo();
            const actions = [];

            actions.push(
              RouterActions.navigate({
                path: endUrl && !endUrl[0].startsWith('/auth')
                  ? [endUrl[0]] : ['landing', 'list'],
                ...(endUrl && endUrl[1]) && {
                  query: getParam(endUrl[1]),
                },
              }),
            );

            return [
              ...actions,
              AuthActions.loginSuccess({
                response: new LoginResponseData(response),
              }),
              UserActions.loadUser(),
              AppActions.setTokenInfo({ scopes: info.scopes, sub: info.sub }),
              VersionActions.loadVersion(),
            ];
          }),
          catchError(error => of(
              AuthActions.loginFailure({ error }),
              NotificationActions.error({
                message: error?.error?.message ?? error?.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AuthActions.logout,
      ),
      switchMap( ({ endUrl }) => {
        return this.authApiService.logout().pipe(
          switchMap(() => {
            this.appStateService.clean(!!endUrl);
            return [];
          }),
          catchError(error => {
            this.appStateService.clean(!!endUrl);

            return of(
              AuthActions.loginFailure({ error }),
              NotificationActions.error({
                message: error.error.message ?? error.message,
              }),
            );
          }),
        );
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private authApiService: AuthApiService,
    private route: ActivatedRoute,
    private appStateService: AppStateService,
  ) {
  }
}
