import { Injectable } from '@angular/core';
import { VehiclesApiService } from '@concordia-nx-ionic/concordia-mobility-api';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { TripActions, VehiclesActions } from '../actions';

@Injectable()
export class VehiclesEffects {
  handleVehicleSignalTypesLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        VehiclesActions.loadSignalTypes,
      ),
      switchMap(({ id }) => {
        return this.vehiclesApiService.getSignalTypes(id).pipe(
          switchMap(rez => {
            return [
              VehiclesActions.loadSignalTypesSuccess(),
              VehiclesActions.addVehiclesSignalTypes({ id: id, data: rez.data }),
            ];
          }),
          catchError(err => of(VehiclesActions.loadSignalTypesFailure({ err }))),
        );
      }),
    ),
  );

  handleVehicleDataLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        VehiclesActions.loadVehicleData,
      ),
      switchMap(({ id, vehicleId, params, value, update }) => {
        return this.vehiclesApiService.getDate(vehicleId, { params }).pipe(
          switchMap(rez => {
            const filters = JSON.parse(params.filter);

            return [
              VehiclesActions.loadVehiclesDataSuccess(),
              VehiclesActions.addVehiclesData({ id: id, value: value, data: rez.data, params: filters, update }),
            ];
          }),
          catchError(err => of(VehiclesActions.loadVehiclesDataFailure({ err }))),
        );
      }),
    ),
  );

  handleVehiclePositionsLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        VehiclesActions.loadVehiclePositions,
      ),
      switchMap(({ tripId, id, params, update }) => {
        return this.vehiclesApiService.getPositions(id, { params }).pipe(
          switchMap(positions => {
            const endDate: number = JSON.parse(params.filter)[1].value;

            return [
              VehiclesActions.loadVehiclePositionsSuccess({ tripId, endDate }),
              TripActions.addVehiclePositions({ tripId: tripId, positions: positions.data, update }),
            ];
          }),
          catchError(err => of(VehiclesActions.loadVehiclePositionsFailure({ err }))),
        );
      }),
    ),
  );

  handleVehicleEventsLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        VehiclesActions.loadVehicleEvents,
      ),
      switchMap(({ tripId, id, params, update }) => {
        return this.vehiclesApiService.getEvents(id, { params }).pipe(
          switchMap(events => {
              const endDate: number = JSON.parse(params.filter)[1].value;

              return [
              VehiclesActions.loadVehiclesEventsSuccess({ tripId, endDate }),
              TripActions.addVehiclesEvents({ tripId: tripId, events: events.data, update }),
            ];
          }),
          catchError(err => of(VehiclesActions.loadVehiclesEventsFailure({ err }))),
        );
      }),
    ),
  );

  handleVehicleIdleTime$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        VehiclesActions.loadIdleTime,
      ),
      switchMap(({ tripId, id, params, update }) => {
        return this.vehiclesApiService.getIdleTime(id, { params }).pipe(
          switchMap(events => {
            const endDate: number = JSON.parse(params.filter)[1].value;

            return [
              VehiclesActions.loadIdleTimeSuccess({ tripId, data: events.data, endDate, update }),
            ];
          }),
          catchError(err => of(VehiclesActions.loadVehiclesEventsFailure({ err }))),
        );
      }),
    ),
  );

  handleVehicleHarshEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        VehiclesActions.loadHarshEvents,
      ),
      switchMap(({ tripId, id, params, update }) => {
        return this.vehiclesApiService.getHarshEvents(id, { params }).pipe(
          switchMap(events => {
            const endDate: number = JSON.parse(params.filter)[1].value;

            return [
              VehiclesActions.loadHarshEventsSuccess({ tripId, data: events.data, endDate, update }),
            ];
          }),
          catchError(err => of(VehiclesActions.loadHarshEventsFailure({ err }))),
        );
      }),
    ),
  );

  handleVehicleLongEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        VehiclesActions.loadLongEvents,
      ),
      switchMap(({ tripId, id, params, update }) => {
        return this.vehiclesApiService.getLongEvents(id, { params }).pipe(
          switchMap(events => {
            const endDate: number = JSON.parse(params.filter)[1].value;

            return [
              VehiclesActions.loadLongEventsSuccess({ tripId, data: events.data, endDate, update }),
            ];
          }),
          catchError(err => of(VehiclesActions.loadLongEventsFailure({ err }))),
        );
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    public readonly vehiclesApiService: VehiclesApiService,
  ) {
  }
}
