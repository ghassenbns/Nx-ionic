import { createAction, props } from '@ngrx/store';
import { IndividualConfig } from 'ngx-toastr';

export const success = createAction(
  '[UI] Notification Success',
  props<{
    message: string;
    options?: Partial<IndividualConfig>;
  }>(),
);

export const error = createAction(
  '[UI] Notification Error',
  props<{
    message: string;
    options?: Partial<IndividualConfig>;
  }>(),
);
