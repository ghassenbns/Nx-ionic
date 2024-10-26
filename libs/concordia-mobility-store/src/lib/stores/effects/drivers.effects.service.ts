import { Injectable } from '@angular/core';
import { DriversApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { DriversActions, TripActions } from '../actions';

@Injectable()
export class DriversEffectsService {
  handleDriversEventsLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        DriversActions.loadDriverEvents,
      ),
      switchMap(({ tripId, id, params, update }) => {
        return this.driversApiService.getEvents(id, { params }).pipe(
          switchMap(events => {
            const endDate: number = JSON.parse(params.filter)[1].value;

            return [
              DriversActions.loadDriverEventsSuccess({ tripId, endDate }),
              TripActions.addDriverEvents({ tripId: tripId, events: events.data, update }),
            ];
          }),
          catchError(err => of(DriversActions.loadDriverEventsFailure({ err }))),
        );
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    public readonly driversApiService: DriversApiService,
  ) {
  }
}
