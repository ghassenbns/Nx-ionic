import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { NotificationService } from '../../services';
import { NotificationActions } from '../actions';

@Injectable()
export class NotificationEffects {

  handleSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        NotificationActions.success,
      ),
      tap(({ message, options }) => {

        this.notification.show(message, '', 'success', options );

      }),
    ),
    { dispatch: false },
  );

  handleError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        NotificationActions.error,
      ),
      tap(({ message, options }) => {

        this.notification.show(message, '', 'error', options );

      }),
    ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private notification: NotificationService,
  ) { }

}
