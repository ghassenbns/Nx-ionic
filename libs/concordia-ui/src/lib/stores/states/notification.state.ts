import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { NotificationActions } from '../actions';

@Injectable({
  providedIn: 'root',
})
export class UINotificationStateService {

  constructor(
    private store: Store,
  ) { }

  success(message: string): void {

    this.store.dispatch(
      NotificationActions.success({
        message,
      }),
    );

  }

  error(message: string): void {

    this.store.dispatch(
      NotificationActions.error({
        message,
      }),
    );

  }

}
