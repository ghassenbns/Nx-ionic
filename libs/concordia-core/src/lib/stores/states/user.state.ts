import { Injectable } from '@angular/core';
import { DecimalSeparator, ThousandSeparator, UserInterface } from '@concordia-nx-ionic/concordia-auth-api';
import { select, Store } from '@ngrx/store';
import { filter, map, Observable } from 'rxjs';

import { Status } from '../../interfaces';
import { UserActions } from '../actions';
import * as fromUserSelectors from '../selectors/user.selectors';

@Injectable()
export class UserStateService {

  constructor(private store: Store<never>) {
  }

  loadUser(): void {
    return this.store.dispatch(UserActions.loadUser());
  }

  getUser$(): Observable<UserInterface | null> {
    return this.store.pipe(select(fromUserSelectors.selectCurrentUser));
  }

  getUserMane(): Observable<string> {
    return this.store.pipe(select(fromUserSelectors.selectCurrentUserName));
  }

  getUserTheme$(): Observable<string> {
    return this.store.pipe(select(fromUserSelectors.selectCurrentUserTheme));
  }

  getDisplayDensity$(): Observable<string> {
    return this.store.pipe(select(fromUserSelectors.selectDisplayDensity));
  }

  getStatus$(): Observable<Status> {
    return this.store.pipe(select(fromUserSelectors.selectCurrentUserStatus));
  }

  getUserLevelId$(): Observable<number | null> {
    return this.store.pipe(select(fromUserSelectors.selectCurrentUserLevelId));
  }

  isAdminMore$(): Observable<boolean> {
    return this.store.pipe(select(fromUserSelectors.selectCurrentUserLevelId))
      .pipe(
        filter(i=> !!i),
        map(i => i === 1 || i === 2),
      );
  }

  isSuperAdmin$(): Observable<boolean> {
    return this.store.pipe(select(fromUserSelectors.selectCurrentUserLevelId))
      .pipe(
        filter(i=> !!i),
        map(i => i === 1),
      );
  }

  getLocale$(): Observable<string | null> {
    return this.store.pipe(select(fromUserSelectors.selectCurrentUserLanguage));
  }

  getLocaleAbr$(): Observable<string> {
    return this.store.pipe(select(fromUserSelectors.selectCurrentUserLanguage))
      .pipe(
        map(lang => {
          const array = lang?.split('_');
          return array && array[0] || '';
        }),
      );
  }

  getDateTimeFormat$(): Observable<string | null> {
    return this.store.pipe(select(fromUserSelectors.selectCurrentUserDateTimeFormat))
      .pipe(
        map((i: string | null) => {
          return i && i.includes('_12h')
            ? i.replace('_12h', ' a')
            : i;
        }),
      );
  }

  getTZ$(): Observable<string | null> {
    return this.store.pipe(select(fromUserSelectors.selectCurrentUserTZ));
  }

  getDecimalSeparator$(): Observable<DecimalSeparator> {
    return this.store.pipe(select(fromUserSelectors.selectCurrentUserDecimalSeparator));
  }

  getThousandSeparator$(): Observable<ThousandSeparator> {
    return this.store.pipe(select(fromUserSelectors.selectCurrentUserThousandSeparator));
  }
}
