import { HttpErrorResponse } from '@angular/common/http';
import { TimezoneInterface } from '@concordia-nx-ionic/concordia-api';
import { createAction, props } from '@ngrx/store';

export const loadTimezones = createAction(
  '[Concordia API] Load Timezones',
);

export const addTimezones = createAction(
  '[Concordia API] Add Timezones',
  props<{
    timezones: TimezoneInterface[];
  }>(),
);

export const loadTimezonesSuccess = createAction(
  '[Concordia API] Load Timezones Success',
);

export const loadTimezonesFailure = createAction(
  '[Concordia API] Load Timezones Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);
