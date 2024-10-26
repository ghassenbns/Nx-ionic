import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, first, map, Observable } from 'rxjs';

import { DriversActions } from '../actions';
import * as fromDriversSelectors from '../selectors/drivers.selectors';
import * as fromTripsSelectors from '../selectors/trips.selectors';

@Injectable()
export class DriversStateService {
  constructor(private store: Store<never>) {
  }

  loadEvents(tripId: string, id: string | number,
             actualStartDate: number | null, actualEndDate: number | null, update: boolean): void {

    combineLatest([
      this.store.pipe(select(fromDriversSelectors.selectDriversEvents))
        .pipe(
          map(i => i[tripId]),
        ),
      this.store.pipe(select(fromTripsSelectors.selectTripsEntities))
        .pipe(
          map(i => i[tripId]),
        ),
    ])
      .pipe(
        first(),
      )
      .subscribe(([events, obj]) => {
        if (!obj.driverDetails.events || update) {
          const params = {
            filter: JSON.stringify([
              {
                scope: 'date',
                operator: '>=',
                value: events?.endDate && update ? +events?.endDate + 1 : actualStartDate,
                type: 'ts',
              },
              {
                scope: 'date',
                operator: '<=',
                value: actualEndDate,
                type: 'ts',
              },
            ]),
            ignorePagination: true,
          };

          this.store.dispatch(DriversActions.loadDriverEvents({
            tripId: tripId,
            id: id,
            params: params,
            update: update,
          }));
        }
      });
  }

  getEventsPendingStatus$(): Observable<boolean> {
    return this.store.pipe(select(fromDriversSelectors.selectDriversEventsLoadStatusPending));
  }
}
