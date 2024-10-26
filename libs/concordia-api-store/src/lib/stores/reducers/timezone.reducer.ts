import { TimezoneInterface } from '@concordia-nx-ionic/concordia-api';
import { Status } from '@concordia-nx-ionic/concordia-core';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { TimezonesActions } from '../actions';

export const adapter: EntityAdapter<TimezoneInterface> = createEntityAdapter<TimezoneInterface>({
  selectId: a => a.timezoneId,
});

export interface TimezonesState extends EntityState<TimezoneInterface> {
  timezones: TimezoneInterface[];
  status: {
    load: Status;
  };
}

export const initialState: TimezonesState = adapter.getInitialState({
  timezones: [],
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
  on(TimezonesActions.loadTimezones, state => ({
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
  on(TimezonesActions.loadTimezonesSuccess,
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
  on(TimezonesActions.loadTimezonesFailure,
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
  on(TimezonesActions.addTimezones,
    (state, { timezones }) => ({
      ...state,
      timezones: timezones,
    }),
  ),

);

const { selectAll } = adapter.getSelectors();

export const selectTimezones = selectAll;
