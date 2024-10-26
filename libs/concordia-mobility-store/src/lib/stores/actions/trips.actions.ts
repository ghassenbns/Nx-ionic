import { HttpErrorResponse } from '@angular/common/http';
import { EventsInterface, PositionsInterface } from '@concordia-nx-ionic/concordia-mobility-api';
import { createAction, props } from '@ngrx/store';

export const loadTrip = createAction(
  '[Concordia Mobility] Load Trip',
  props<{
    id: string;
  }>(),
);

export const addTrip = createAction(
  '[Concordia Mobility] Add Trip',
  props<{
    trip: any;
  }>(),
);

export const loadTripSuccess = createAction(
  '[Concordia Mobility] Load Trip Success',
);

export const loadTripFailure = createAction(
  '[Concordia Mobility] Load Trip Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);

export const loadTripEvents = createAction(
  '[Concordia Mobility] Load Trip Events',
  props<{
    id: string;
    params: any;
  }>(),
);

export const addTripEvents = createAction(
  '[Concordia Mobility] Add Trip Events',
  props<{
    tripId: string;
    events: EventsInterface;
  }>(),
);

export const loadTripEventsSuccess = createAction(
  '[Concordia Mobility] Load Trip Events Success',
);

export const loadTripEventsFailure = createAction(
  '[Concordia Mobility] Load Trip Events Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);

export const addVehiclePositions = createAction(
  '[Concordia Mobility] Add Vehicle Positions to Trip Id',
  props<{
    tripId: string;
    positions: PositionsInterface;
    update: boolean;
  }>(),
);

export const addVehiclesEvents = createAction(
  '[Concordia Mobility] Add Vehicles Events to Trip Id',
  props<{
    tripId: string;
    events: EventsInterface;
    update: boolean;
  }>(),
);

export const addDriverEvents = createAction(
  '[Concordia Mobility] Add Driver Events',
  props<{
    tripId: string;
    events: EventsInterface;
    update: boolean;
  }>(),
);

export const toggleTrajectoryTime = createAction(
  '[Concordia Mobility] Toggle Trajectory Time',
  props<{
    time: number | null;
  }>(),
);

export const toggleZoomTime = createAction(
  '[Concordia Mobility] Toggle Zoom Time',
  props<{
    time: number | null;
  }>(),
);

export const toggleChartTime = createAction(
  '[Concordia Mobility] Toggle Chart Time',
  props<{
    time: number | null;
  }>(),
);
