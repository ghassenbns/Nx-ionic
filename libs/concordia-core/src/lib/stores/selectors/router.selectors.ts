import * as fromRouter from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StateRoute } from '../../interfaces';

export interface State {
  router: fromRouter.RouterReducerState<StateRoute>;
}

export const selectRouter = createFeatureSelector<
  State,
  fromRouter.RouterReducerState<StateRoute>
>('router');

export const selectRoute = createSelector(
  selectRouter,
  (routerReducerState) => routerReducerState.state,
);

export const selectRouteUrl = createSelector(
  selectRoute,
  (routerReducerState) => routerReducerState.url,
);

export const selectRouteParams = createSelector(
  selectRoute,
  (routerReducerState) => routerReducerState.params,
);

export const selectRouteParam = createSelector(
  selectRoute,
  (routerReducerState: StateRoute, props: any) =>
    routerReducerState.params[props.paramName],
);

export const selectRouteQueryParams = createSelector(
  selectRoute,
  (routerReducerState) => routerReducerState.queryParams,
);

export const selectRouteQueryParam = createSelector(
  selectRoute,
  (routerReducerState: StateRoute, props: any) =>
    routerReducerState.queryParams[props.queryParamName],
);
