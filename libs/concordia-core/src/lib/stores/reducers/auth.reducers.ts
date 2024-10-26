import { createReducer, on } from '@ngrx/store';

import { Status } from '../../interfaces';
import * as AuthActions from '../actions/auth.actions';

export interface AuthState {
  status: Status;
}

export const authInitialState: AuthState = {
  status: {
    resolved : false,
    rejected : false,
    err : null,
    pending : false,
  },
};

export const authReducer = createReducer(
  authInitialState,
  on(AuthActions.login, (state) => ({
    ...state,
    status: {
      ...state.status,
      pending : true,
    },
  })),
  on(AuthActions.loginSuccess, (state ) => ({
    ...state,
    status: {
      ...state.status,
      pending : false,
      resolved : true,
    },
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    status: {
      ...state.status,
      resolved : false,
      pending : false,
      rejected: true,
      err : error,
    },
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
  })),
);
