import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

export const boot = createAction('[App] Boot');

export const bootSuccess = createAction(
  '[App] Boot Success',
  props<{
    scopes: string[];
    sub: string;
  }>(),
);

export const bootFailure = createAction(
  '[App] Boot Failure',
  props<{ err: HttpErrorResponse }>(),
);

export const setTokenInfo = createAction(
  '[App] Set Token Info',
  props<{
    scopes: string[];
    sub: string;
  }>(),
);

export const clear = createAction(
  '[App] Clear',
);
