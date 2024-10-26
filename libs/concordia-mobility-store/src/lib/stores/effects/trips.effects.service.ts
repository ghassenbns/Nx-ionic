import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TripsApiServices } from '@concordia-nx-ionic/concordia-mobility-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, tap } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { TripActions } from '../actions';

@Injectable()
export class TripsEffects {
  handleTripsLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TripActions.loadTrip,
      ),
      switchMap(({ id }) => {
        return this.tripsApiServices.show(id).pipe(
          switchMap(folderInfo => {
            return [
              TripActions.loadTripSuccess(),
              TripActions.addTrip({ trip: folderInfo.data }),
            ];
          }),
          catchError(err => of(TripActions.loadTripFailure({ err }))),
        );
      }),
    ),
  );

  handleNavigateByUrl$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TripActions.loadTripFailure),
        tap(() => {
          this.router.navigateByUrl('/trips').then();
        }),
      ),
    { dispatch: false },
  );

  handleTripsEventsLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TripActions.loadTripEvents,
      ),
      switchMap(({ id, params }) => {
        return this.tripsApiServices.getEvents(id, { params }).pipe(
          switchMap(events => {
            return [
              TripActions.loadTripEventsSuccess(),
              TripActions.addTripEvents({ tripId: id, events: events.data }),
            ];
          }),
          catchError(err => of(TripActions.loadTripEventsFailure({ err }))),
        );
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly tripsApiServices: TripsApiServices,
  ) {
  }
}
