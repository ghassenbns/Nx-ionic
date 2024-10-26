import { Status } from '@concordia-nx-ionic/concordia-core';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { DriversActions } from '../actions';

export const adapter: EntityAdapter<any> = createEntityAdapter<any>({
  selectId: a => a._id,
});

export interface DocumentState extends EntityState<any> {
  events: any,
  status: {
    load_events: Status;
  };
}

export const initialState: DocumentState = adapter.getInitialState({
  events: {},
  status: {
    load_events: {
      pending: false,
      resolved: false,
      rejected: false,
      err: null,
    },
  },
});

export const reducer = createReducer(
  initialState,
  on(DriversActions.loadDriverEvents, state => ({
      ...state,
      status: {
        ...state.status,
        load_events: {
          ...state.status.load_events,
          pending: true,
          err: null,
        },
      },
    }),
  ),
  on(DriversActions.loadDriverEventsSuccess,
    (state, { tripId, endDate }) => ({
      ...state,
      events: {
        [tripId]: {
          endDate: endDate,
        },
      },
      status: {
        ...state.status,
        load_events: {
          resolved: true,
          rejected: false,
          pending: false,
          err: null,
        },
      },
    }),
  ),
  on(DriversActions.loadDriverEventsFailure,
    (state, { err }) => ({
      ...state,
      status: {
        ...state.status,
        load_events: {
          resolved: false,
          rejected: true,
          pending: false,
          err,
        },
      },
    }),
  ),
);

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectTrips = selectAll;
export const selectTripsEntities = selectEntities;
