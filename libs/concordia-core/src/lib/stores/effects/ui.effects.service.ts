import { Injectable } from '@angular/core';
import { HelpApiService } from '@concordia-nx-ionic/concordia-auth-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { UiActions } from '../actions';

@Injectable()
export class UiEffectsService {
  handleVersionLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UiActions.loadHelp,
      ),
      switchMap(({ lang, page }) => {
        return this.helpApiService.load(lang, page).pipe(
          switchMap(date => {
            return [
              UiActions.loadHelpSuccess({ lang, page, date }),
            ];
          }),
          catchError(() => of(UiActions.loadHelpFailure())),
        );
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly helpApiService: HelpApiService,
  ) {
  }
}
