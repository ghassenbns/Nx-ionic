import { HttpErrorResponse } from '@angular/common/http';
import { ApiVersionInterface } from '@concordia-nx-ionic/concordia-auth-api';
import { createAction, props } from '@ngrx/store';

export const loadVersion = createAction(
  '[Concordia API] Load Version',
);

export const addVersion = createAction(
  '[Concordia API] Add Version',
  props<{
    version: ApiVersionInterface;
  }>(),
);

export const loadVersionSuccess = createAction(
  '[Concordia API] Load Version Success',
);

export const loadVersionFailure = createAction(
  '[Concordia API] Load Version Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);
