import { Injectable } from '@angular/core';
import { TimezoneApiService } from '@concordia-nx-ionic/concordia-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { TimezonesActions } from '../actions';

@Injectable()
export class TimezonesEffects {
  handleVersionLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TimezonesActions.loadTimezones,
      ),
      switchMap(() => {
        return this.timezoneApiService.list().pipe(
          switchMap(data => {
            return [
              TimezonesActions.loadTimezonesSuccess(),
              TimezonesActions.addTimezones({ timezones: data.data }),
            ];
          }),
          catchError(err => of(TimezonesActions.loadTimezonesFailure({ err }))),
        );
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly timezoneApiService: TimezoneApiService,
  ) {
  }
}
