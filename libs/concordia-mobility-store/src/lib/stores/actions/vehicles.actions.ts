import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

export const loadSignalTypes = createAction(
  '[Concordia Mobility] Load Vehicle Signal Types',
  props<{
    id: string | number;
  }>(),
);

export const loadSignalTypesSuccess = createAction(
  '[Concordia Mobility] Load Vehicle Signal Types Success',
);

export const loadSignalTypesFailure = createAction(
  '[Concordia Mobility] Load Vehicle Signal Types Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);

export const addVehiclesSignalTypes = createAction(
  '[Concordia Mobility] Add Vehicle Signal Types',
  props<{
    id: string | number;
    data: any;
  }>(),
);

export const loadVehiclePositions = createAction(
  '[Concordia Mobility] Load Vehicle positions',
  props<{
    tripId: string;
    id: string | number;
    params: any;
    update: boolean;
  }>(),
);

export const loadVehiclePositionsSuccess = createAction(
  '[Concordia Mobility] Load Vehicle Positions Success',
  props<{
    tripId: string;
    endDate: number;
  }>(),
);

export const loadVehiclePositionsFailure = createAction(
  '[Concordia Mobility] Load Vehicle Positions Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);

export const loadVehicleEvents = createAction(
  '[Concordia Mobility] Load Vehicle Events',
  props<{
    tripId: string;
    id: string | number;
    params: any;
    update: boolean;
  }>(),
);

export const loadVehiclesEventsSuccess = createAction(
  '[Concordia Mobility] Load Trip Events Success',
  props<{
    tripId: string;
    endDate: number;
  }>(),
);

export const loadVehiclesEventsFailure = createAction(
  '[Concordia Mobility] Load Trip Events Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);

export const loadVehicleData = createAction(
  '[Concordia Mobility] Load Vehicle Data',
  props<{
    id: string;
    value: number[];
    vehicleId: string | number;
    params: any;
    update: boolean;
  }>(),
);

export const addVehiclesData = createAction(
  '[Concordia Mobility] Add Trip Data',
  props<{
    id: string;
    data: any;
    value: number[];
    params: any;
    update: boolean;
  }>(),
);

export const loadVehiclesDataSuccess = createAction(
  '[Concordia Mobility] Load Trip Data Success',
);

export const loadVehiclesDataFailure = createAction(
  '[Concordia Mobility] Load Trip Data Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);

export const loadIdleTime = createAction(
  '[Concordia Mobility] Load Idle Time',
  props<{
    tripId: string;
    id: string | number;
    params: any;
    update: boolean;
  }>(),
);

export const loadIdleTimeSuccess = createAction(
  '[Concordia Mobility] Load Idle Time Success',
  props<{
    tripId: string;
    data: any;
    endDate: number;
    update: boolean;
  }>(),
);

export const loadIdleTimeFailure = createAction(
  '[Concordia Mobility] Load Idle Time Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);

export const loadHarshEvents = createAction(
  '[Concordia Mobility] Load Harsh Events',
  props<{
    tripId: string;
    id: string | number;
    params: any;
    update: boolean;
  }>(),
);

export const loadHarshEventsSuccess = createAction(
  '[Concordia Mobility] Load Harsh Events Success',
  props<{
    tripId: string;
    data: any;
    endDate: number;
    update: boolean;
  }>(),
);

export const loadHarshEventsFailure = createAction(
  '[Concordia Mobility] Load Harsh Events Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);

export const loadLongEvents = createAction(
  '[Concordia Mobility] Load Long Events',
  props<{
    tripId: string;
    id: string | number;
    params: any;
    update: boolean;
  }>(),
);

export const loadLongEventsSuccess = createAction(
  '[Concordia Mobility] Load Long Events Success',
  props<{
    tripId: string;
    data: any;
    endDate: number;
    update: boolean;
  }>(),
);

export const loadLongEventsFailure = createAction(
  '[Concordia Mobility] Load Long Events Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);
