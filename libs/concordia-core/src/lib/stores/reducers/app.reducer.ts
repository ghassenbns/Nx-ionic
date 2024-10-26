import { createReducer, on } from '@ngrx/store';

import { Status } from '../../interfaces';
import { AppActions } from '../actions';

export interface AppState {
  scopes: string[];
  sub: string;
  status: Status;
}

export const initialState: AppState = {
  scopes: [],
  sub: '',
  status: {
    resolved: false,
    rejected: false,
    pending: false,
    err: null,
  },
};

export const reducer = createReducer(
  initialState,
  on(AppActions.boot, (state) => ({
    ...state,
    status: {
      ...state.status,
      pending: true,
    },
  })),
  on(AppActions.bootSuccess, (state) => ({
    ...state,
    status: {
      resolved: true,
      rejected: false,
      pending: false,
      err: null,
    },
  })),
  on(AppActions.bootFailure, (state, { err }) => ({
    ...state,
    status: {
      resolved: false,
      rejected: true,
      pending: false,
      err,
    },
  })),
  on(AppActions.setTokenInfo,
    (state, { scopes, sub }) => ({
      ...state,
      scopes,
      sub,
    }),
  ),
  on(AppActions.clear,
    (state) => ({
      ...state,
      ...initialState,
    }),
  ),
);
