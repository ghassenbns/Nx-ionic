import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

export const loadDriverEvents = createAction(
  '[Concordia Mobility] Load Driver Events',
  props<{
    tripId: string;
    id: string | number;
    params: any;
    update: boolean;
  }>(),
);

export const loadDriverEventsSuccess = createAction(
  '[Concordia Mobility] Load Driver Events Success',
  props<{
    tripId: string;
    endDate: number;
  }>(),
);

export const loadDriverEventsFailure = createAction(
  '[Concordia Mobility] Load Driver Events Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);
