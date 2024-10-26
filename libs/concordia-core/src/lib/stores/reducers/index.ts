import { InjectionToken } from '@angular/core';
import * as fromRouter from '@ngrx/router-store';
import { Action, ActionReducerMap } from '@ngrx/store';

import { StateRoute } from '../../interfaces';
import * as fromAppReducer from './app.reducer';
import * as fromAuthReducer from './auth.reducers';
import * as fromUiReducer from './ui.reducers';
import * as fromUserReducer from './user.reducer';
import * as fromVersionsReducer from './version.reducer';

export interface State {
  app: fromAppReducer.AppState;
  router: fromRouter.RouterReducerState<StateRoute>;
  user: fromUserReducer.UserState;
  auth: fromAuthReducer.AuthState;
  ui: fromUiReducer.UiState;
  versions: fromVersionsReducer.VersionState;
}

export const ROOT_REDUCERS = new InjectionToken<
  ActionReducerMap<State, Action>
>('Root reducers token', {
  factory: () => ({
    app: fromAppReducer.reducer,
    router: fromRouter.routerReducer,
    user: fromUserReducer.reducer,
    auth: fromAuthReducer.authReducer,
    ui: fromUiReducer.authReducer,
    versions: fromVersionsReducer.reducer,
  }),
});

export const selectAppState = (state: State): fromAppReducer.AppState => state.app;
export const selectRouterState = (state: State): fromRouter.RouterReducerState<StateRoute> => state.router;
export const selectUserState = (state: State): fromUserReducer.UserState => state.user;
export const selectAuthState = (state: State): fromAuthReducer.AuthState => state.auth;
export const selectUiState = (state: State): fromUiReducer.UiState => state.ui;
export const selectVersionsState = (state: State): fromVersionsReducer.VersionState => state.versions;
