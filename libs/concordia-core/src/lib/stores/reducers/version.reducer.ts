import { HttpErrorResponse } from '@angular/common/http';
import { ApiVersionInterface } from '@concordia-nx-ionic/concordia-auth-api';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { VersionActions } from '../actions';

export const adapter: EntityAdapter<ApiVersionInterface> = createEntityAdapter<ApiVersionInterface>({
  selectId: a => a.semver,
});

export interface VersionState extends EntityState<ApiVersionInterface> {
  semver: string;
  status: {
    load:
      {
        resolved: boolean;
        rejected: boolean;
        pending: boolean;
        err: HttpErrorResponse | null;
      }
  };
}

export const initialState: VersionState = adapter.getInitialState({
  semver: '',
  status: {
    load: {
      pending: false,
      resolved: false,
      rejected: false,
      err: null,
    },
  },
});

export const reducer = createReducer(
  initialState,
  on(VersionActions.loadVersion, state => ({
      ...state,
      status: {
        ...state.status,
        load: {
          ...state.status.load,
          pending: true,
          err: null,
        },
      },
    }),
  ),
  on(VersionActions.loadVersionSuccess,
    (state) => ({
      ...state,
      status: {
        ...state.status,
        load: {
          resolved: true,
          rejected: false,
          pending: false,
          err: null,
        },
      },
    }),
  ),
  on(VersionActions.loadVersionFailure,
    (state, { err }) => ({
      ...state,
      status: {
        ...state.status,
        load: {
          resolved: false,
          rejected: true,
          pending: false,
          err,
        },
      },
    }),
  ),
  on(VersionActions.addVersion,
    (state, { version }) => ({
      ...state,
      semver: version.semver,
    }),
  ),
);

const { selectAll } = adapter.getSelectors();

export const selectVersions = selectAll;
