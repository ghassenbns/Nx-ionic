import { Injectable } from '@angular/core';
import { ApiVersionService } from '@concordia-nx-ionic/concordia-auth-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { VersionActions } from '../actions';

@Injectable()
export class VersionEffects {
  handleVersionLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        VersionActions.loadVersion,
      ),
      switchMap(() => {
        return this.apiVersionService.getApiVersion().pipe(
          switchMap(data => {
            return [
              VersionActions.loadVersionSuccess(),
              VersionActions.addVersion({ version: data.data }),
            ];
          }),
          catchError(err => of(VersionActions.loadVersionFailure({ err }))),
        );
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly apiVersionService: ApiVersionService,
  ) {
  }
}
