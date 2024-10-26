import { NavigationExtras, UrlTree } from '@angular/router';
import { createAction, props } from '@ngrx/store';

export const navigateByUrl = createAction(
  '[Router] Navigate by Url',
  props<{
    url: string | UrlTree;
    extras?: NavigationExtras;
  }>(),
);

export const navigate = createAction(
  '[Router] Navigate',
  props<{
    path: any[];
    // eslint-disable-next-line @typescript-eslint/ban-types
    query?: object;
    extras?: NavigationExtras;
  }>(),
);

export const back = createAction('[Router] Back');

export const forward = createAction('[Router] Forward');
