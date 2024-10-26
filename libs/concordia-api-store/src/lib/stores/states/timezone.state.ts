import { Injectable } from '@angular/core';
import { TimezoneInterface } from '@concordia-nx-ionic/concordia-api';
import { select, Store } from '@ngrx/store';
import { first, Observable } from 'rxjs';

import { TimezonesActions } from '../actions';
import * as fromTimezonesSelectors from '../selectors/timezone.selectors';

@Injectable()
export class TimezonesStateService {
  constructor(private store: Store<never>) {
  }

  loadTimezones(): void {
    this.store.pipe(select(fromTimezonesSelectors.selectTimezones))
      .pipe(
        first(),
      )
      .subscribe((obj: TimezoneInterface[]) => {
        if (!obj.length) {
          this.store.dispatch(TimezonesActions.loadTimezones());
        }
      });
  }

  getTimezones(): Observable<TimezoneInterface[]> {
    return this.store.pipe(select(fromTimezonesSelectors.selectTimezones));
  }

  getTimezone(id: number): Observable<TimezoneInterface | undefined> {
    return this.store.select(fromTimezonesSelectors.selectTimezone({ timezoneId: id }));
  }
}
