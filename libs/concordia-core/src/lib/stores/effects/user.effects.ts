import { Injectable } from '@angular/core';
import { UserApiService, UserConfigService } from '@concordia-nx-ionic/concordia-auth-api';
import { TranslocoService } from '@ngneat/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { UserActions } from '../actions';
import * as AuthActions from '../actions/auth.actions';
import { ThemeService } from '../states';

@Injectable()
export class UserEffects {
  handleUserLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UserActions.loadUser,
      ),
      switchMap(() => {

        return this.userApiService.getUser().pipe(
          switchMap(({ data }) => {
            this.translocoService.setActiveLang(data.langEmail.split('_')[0]);

            this.themeService.setTheme(data?.settings?.userInterface?.theme);

            return [
              UserActions.loadUserSuccess({ userId: data.userId, name: data.name, email: data.email,
                userLevelId: data.userLevelId, langEmail: data.langEmail, settings: data.settings }),
              UserActions.addUser({ user: data }),
            ];
          }),
          catchError(err => {
            return of(
              AuthActions.logout({ endUrl: true }),
              UserActions.loadUserFailure({ err }),
              );
          }),
        );
      }),
    ),
  );

  handleUserUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UserActions.updateUserInterface,
      ),
      switchMap(({ userId, theme }) => {

        return this.userConfigService.edit({ user_id: userId, theme }).pipe(
          switchMap(({ data }) => {
            this.themeService.setTheme(data?.settings?.userInterface?.theme);

            return [
               UserActions.updateUserInterfaceSuccess({ settings: data.settings }),
            ];
          }),
          catchError(err => {
            return of(
              UserActions.updateUserInterfaceFailure({ err }),
            );
          }),
        );
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private readonly userApiService: UserApiService,
    private readonly userConfigService: UserConfigService,
    private translocoService: TranslocoService,
    private readonly themeService: ThemeService,
  ) {}
}
