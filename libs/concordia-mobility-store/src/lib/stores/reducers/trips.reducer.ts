import { Status } from '@concordia-nx-ionic/concordia-core';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as dayjs from 'dayjs';

import { TripActions } from '../actions';

export const adapter: EntityAdapter<any> = createEntityAdapter<any>({
  selectId: a => a._id,
});

export interface DocumentState extends EntityState<any> {
  trajectoryTime: number | null;
  chartTime: number | null;
  zoomTime: number | null;
  status: {
    load: Status;
    load_events: Status;
  };
}

export const initialState: DocumentState = adapter.getInitialState({
  trajectoryTime: null,
  chartTime: null,
  zoomTime: null,
  status: {
    load: {
      pending: false,
      resolved: false,
      rejected: false,
      err: null,
    },
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
  on(TripActions.loadTrip, state => ({
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
  on(TripActions.loadTripSuccess,
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
  on(TripActions.loadTripFailure,
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
  on(TripActions.addTrip,
    (state, { trip }) => {
      const entity = state.entities[trip._id];

      const newTrip = {
        ...trip,
        _endDate: trip.actualEndDate || dayjs().valueOf(),
        ...entity && {
          vehicleDetails: {
            ...trip.vehicleDetails,
            ...entity.vehicleDetails.positions && {
              positions: entity.vehicleDetails.positions,
            },
            ...entity.vehicleDetails.events && {
              events: entity.vehicleDetails.events,
            },
          },
          driverDetails: {
            ...trip.driverDetails,
            ...entity.driverDetails.events && {
              events: entity.driverDetails.events,
            },
          },
        },
        ...entity && entity.events && {
          events: entity.events,
        },
      };

      return adapter.upsertOne(newTrip, state);
    },
  ),
  on(TripActions.loadTripEvents, state => ({
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
  on(TripActions.loadTripEventsSuccess,
    (state) => ({
      ...state,
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
  on(TripActions.loadTripEventsFailure,
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
  on(TripActions.addVehiclePositions,
    (state, { tripId, positions, update }) => ({
      ...state,
      entities: {
        ...state.entities,
        [tripId]: {
          ...state.entities[tripId],
          vehicleDetails: {
            ...state.entities[tripId].vehicleDetails,
            positions: update && state.entities[tripId].vehicleDetails?.positions?.features?.length
              ? {
                ...positions,
                features: [
                  ...state.entities[tripId].vehicleDetails.positions.features,
                  ...positions.features,
                ],
              }
              : positions,
          },
        },
      },
    }),
  ),
  on(TripActions.addVehiclesEvents,
    (state, { tripId, events, update }) => ({
      ...state,
      entities: {
        ...state.entities,
        [tripId]: {
          ...state.entities[tripId],
          vehicleDetails: {
            ...state.entities[tripId].vehicleDetails,
            events: update && state.entities[tripId].vehicleDetails?.events?.features?.length
              ? {
                ...events,
                features: [
                  ...state.entities[tripId].vehicleDetails.events.features,
                  ...events.features,
                ],
              }
              : events,
          },
        },
      },
    }),
  ),
  on(TripActions.addDriverEvents,
    (state, { tripId, events, update }) => ({
      ...state,
      entities: {
        ...state.entities,
        [tripId]: {
          ...state.entities[tripId],
          driverDetails: {
            ...state.entities[tripId].driverDetails,
            events: update && state.entities[tripId].driverDetails?.events?.features?.length
                ? {
                ...events,
                features: [
                  ...state.entities[tripId].driverDetails.events.features,
                  ...events.features,
                ],
              }
              : events,
          },
        },
      },
    }),
  ),
  on(TripActions.addTripEvents,
    (state, { tripId, events }) => ({
      ...state,
      entities: {
        ...state.entities,
        [tripId]: {
          ...state.entities[tripId],
          events: events,
        },
      },
    }),
  ),
  on(TripActions.toggleTrajectoryTime,
    (state, { time }) => ({
      ...state,
      trajectoryTime: time,
    }),
  ),
  on(TripActions.toggleZoomTime,
    (state, { time }) => ({
      ...state,
      zoomTime: time,
    }),
  ),
  on(TripActions.toggleChartTime,
    (state, { time }) => ({
      ...state,
      chartTime: time,
    }),
  ),
);

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectTrips = selectAll;
export const selectTripsEntities = selectEntities;
