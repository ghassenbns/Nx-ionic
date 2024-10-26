import { HttpErrorResponse } from '@angular/common/http';
import { TariffInterface } from '@concordia-nx-ionic/concordia-energy-api';
import { createAction, props } from '@ngrx/store';

export const loadMeter = createAction(
  '[Concordia Energy] Load Meter',
  props<{
    id: string;
  }>(),
);

export const addMeter = createAction(
  '[Concordia Energy] Add Meter',
  props<{
    meter: any;
  }>(),
);

export const updateMeter = createAction(
  '[Concordia Energy] Update Meter',
  props<{
    meter: any;
  }>(),
);

export const loadMeterSuccess = createAction(
  '[Concordia Energy] Load Meter Success',
);

export const loadMeterFailure = createAction(
  '[Concordia Energy] Load Meter Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);

export const loadMeterLatestTariff = createAction(
  '[Concordia Energy] Load Meter Latest Tariff',
  props<{
    id: string;
  }>(),
);

export const addMeterLatestTariff = createAction(
  '[Concordia Energy] Add Meter Latest Tariff',
  props<{
    id: string;
    tariff: TariffInterface | null;
  }>(),
);

export const loadMeterLatestTariffSuccess = createAction(
  '[Concordia Energy] Load Meter Latest Tariff Success',
);

export const loadMeterLatestTariffFailure = createAction(
  '[Concordia Energy] Load Meter Latest Tariff Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);

export const loadMetersListParam = createAction(
  '[Concordia Energy] Load Meters List Param',
  props<{
    viewAsUserId?: string;
    meterIds?: string[];
  }>(),
);

export const addMetersListParam = createAction(
  '[Concordia Energy] Add Meters List Param',
  props<{
    p: any,
    meters: any[];
  }>(),
);
export const loadMetersListParamSuccess = createAction(
  '[Concordia Energy] Load Meter Success',
);

export const loadMetersListParamFailure = createAction(
  '[Concordia Energy] Load Meter Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);
