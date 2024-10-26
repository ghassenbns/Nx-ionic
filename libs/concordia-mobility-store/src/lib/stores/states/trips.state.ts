import { Injectable } from '@angular/core';
import { SignalsInterface, TripsDataInterface } from '@concordia-nx-ionic/concordia-mobility-api';
import { select, Store } from '@ngrx/store';
import { filter, first, map, Observable } from 'rxjs';

import { TripActions } from '../actions';
import * as fromTripsSelectors from '../selectors/trips.selectors';

@Injectable()
export class TripStateService {
  constructor(private store: Store<never>) {
  }

  loadTrip(tripId: any): void {
    if (tripId) {
      this.store.pipe(select(fromTripsSelectors.selectTripsEntities))
        .pipe(
          first(),
          map(trips => trips[tripId]),
          filter(trip => !trip || (trip.tripStatusId !== 6 && trip.tripStatusId !== 7)),
        )
        .subscribe(() => {
          this.store.dispatch(TripActions.loadTrip({
            id: tripId,
          }));
        });
    }
  }

  getTrip(id: string): Observable<TripsDataInterface> {
    return this.store.pipe(select(fromTripsSelectors.selectTripsEntities)).pipe(
      map(i => i[id]),
    );
  }

  getTripSignalsConfig(id: string): Observable<SignalsInterface[]> {
    return this.getTrip(id).pipe(
      map(i => i?.vehicleDetails?.signalsConfig ?? []),
    );
  }

  loadEvents(id: string, update: boolean): void {
    const params = {
      ignorePagination: true,
    };

    this.store.pipe(select(fromTripsSelectors.selectTripsEntities))
      .pipe(
        first(),
        map(i => i[id]),
      )
      .subscribe((obj: any) => {
        if (!obj.events || update) {
          this.store.dispatch(TripActions.loadTripEvents({
            id: id,
            params: params,
          }));
        }
      });
  }

  getPendingStatus$(): Observable<boolean> {
    return this.store.pipe(select(fromTripsSelectors.selectTripLoadStatusPending));
  }

  getEventsPendingStatus$(): Observable<boolean> {
    return this.store.pipe(select(fromTripsSelectors.selectTripEventsLoadStatusPending));
  }

  toggleTrajectoryTime(time: number | null): void {
    return this.store.dispatch(TripActions.toggleTrajectoryTime({ time: time }));
  }

  get trajectoryTime(): Observable<number | null> {
    return this.store.pipe(select(fromTripsSelectors.selectTripTrajectoryTime));
  }

  toggleChartTime(time: number | null): void {
    this.store.dispatch(TripActions.toggleTrajectoryTime({ time: time }));
    return this.store.dispatch(TripActions.toggleChartTime({ time: time }));
  }

  get chartTime(): Observable<number | null> {
    return this.store.pipe(select(fromTripsSelectors.selectTripChartTime));
  }

  toggleZoomTime(time: number | null): void {
    return this.store.dispatch(TripActions.toggleZoomTime({ time: time }));
  }

  get zoomTime(): Observable<number | null> {
    return this.store.pipe(select(fromTripsSelectors.selectZoomTime));
  }
}
