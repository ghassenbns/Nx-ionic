import { Status } from '@concordia-nx-ionic/concordia-core';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { VehiclesActions } from '../actions';

export const adapter: EntityAdapter<any> = createEntityAdapter<any>({
  selectId: a => a._id,
});

export interface DocumentState extends EntityState<any> {
  data: any,
  signalTypes: any,
  positions: any,
  events: any,
  idle_time: any,
  harsh_events: any,
  long_events: any,
  status: {
    load_groups: Status;
    load_positions: Status;
    load_events: Status;
    load_data: Status;
    load_idle_time: Status;
    load_harsh_events: Status;
    load_long_events: Status;
  };
}

export const initialState: DocumentState = adapter.getInitialState({
  data: {},
  signalTypes: {},
  positions: {},
  events: {},
  idle_time: {},
  harsh_events: {},
  long_events: {},
  status: {
    load_groups: {
      pending: false,
      resolved: false,
      rejected: false,
      err: null,
    },
    load_positions: {
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
    load_data: {
      pending: false,
      resolved: false,
      rejected: false,
      err: null,
    },
    load_idle_time: {
      pending: false,
      resolved: false,
      rejected: false,
      err: null,
    },
    load_harsh_events: {
      pending: false,
      resolved: false,
      rejected: false,
      err: null,
    },
    load_long_events: {
      pending: false,
      resolved: false,
      rejected: false,
      err: null,
    },
  },
});

export const reducer = createReducer(
  initialState,
  on(VehiclesActions.loadSignalTypes, state => ({
      ...state,
      status: {
        ...state.status,
        load_groups: {
          ...state.status.load_groups,
          pending: true,
          err: null,
        },
      },
    }),
  ),
  on(VehiclesActions.loadVehiclePositions, state => ({
      ...state,
      status: {
        ...state.status,
        load_positions: {
          ...state.status.load_positions,
          pending: true,
          err: null,
        },
      },
    }),
  ),
  on(VehiclesActions.loadVehicleEvents, state => ({
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
  on(VehiclesActions.loadVehicleData, state => ({
      ...state,
      status: {
        ...state.status,
        load_data: {
          ...state.status.load_data,
          pending: true,
          err: null,
        },
      },
    }),
  ),
  on(VehiclesActions.loadSignalTypesSuccess,
    (state) => ({
      ...state,
      status: {
        ...state.status,
        load_groups: {
          resolved: true,
          rejected: false,
          pending: false,
          err: null,
        },
      },
    }),
  ),
  on(VehiclesActions.loadSignalTypesFailure,
    (state, { err }) => ({
      ...state,
      status: {
        ...state.status,
        load_groups: {
          resolved: false,
          rejected: true,
          pending: false,
          err,
        },
      },
    }),
  ),
  on(VehiclesActions.loadVehiclePositionsSuccess,
    (state, { tripId, endDate }) => ({
      ...state,
      positions: {
        [tripId]: {
          endDate: endDate,
        },
      },
      status: {
        ...state.status,
        load_positions: {
          resolved: true,
          rejected: false,
          pending: false,
          err: null,
        },
      },
    }),
  ),
  on(VehiclesActions.loadVehiclePositionsFailure,
    (state, { err }) => ({
      ...state,
      status: {
        ...state.status,
        load_positions: {
          resolved: false,
          rejected: true,
          pending: false,
          err,
        },
      },
    }),
  ),
  on(VehiclesActions.loadVehiclesEventsSuccess,
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
  on(VehiclesActions.loadVehiclesEventsFailure,
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
  on(VehiclesActions.loadVehiclesDataSuccess,
    (state) => ({
      ...state,
      status: {
        ...state.status,
        load_data: {
          resolved: true,
          rejected: false,
          pending: false,
          err: null,
        },
      },
    }),
  ),
  on(VehiclesActions.loadVehiclesDataFailure,
    (state, { err }) => ({
      ...state,
      status: {
        ...state.status,
        load_data: {
          resolved: false,
          rejected: true,
          pending: false,
          err,
        },
      },
    }),
  ),
  on(VehiclesActions.addVehiclesSignalTypes,
    (state, { id, data }) => ({
      ...state,
      signalTypes: {
        ...state.signalTypes,
        [id]: data,
      },
    }),
  ),
  on(VehiclesActions.addVehiclesData,
    (state, { id, data, value, params, update }) => ({
      ...state,
      data: {
        ...state.data,
        [id]: state.data[id]
          ? [
            ...state.data[id].filter((d: any) => !value.includes(d.vehicleSignalTypeId)),
            ...data.map((d: any) => {
              const currentData = state.data[id]
                ?.find((c: any) => d.vehicleSignalTypeId === c.vehicleSignalTypeId);

              return {
                ...d,
                ...(!currentData?.samples.length || !update) && {
                  samples: [
                    ...d.samples,
                  ],
                },
                ...currentData?.samples.length && update && {
                  samples: [
                    ...currentData.samples,
                    ...d.samples,
                  ],
                },

                ...currentData?.stats && {
                  stats: {
                    min: d.stats.min && d.stats.min < currentData.stats.min ? d.stats.min : currentData.stats.min,
                    max: d.stats.max && d.stats.max < currentData.stats.max ? d.stats.max : currentData.stats.max,
                  },
                },

                startDate: update && currentData?.startDate ? currentData?.startDate : params[0].value,
                endDate: params[1].value,

              };
            }),
          ]
          : data.map((d: any) => ({
            ...d,
            startDate: params[0].value,
            endDate: params[1].value,
          })),
      },
    }),
  ),
  on(VehiclesActions.loadIdleTime, state => ({
      ...state,
      status: {
        ...state.status,
        load_idle_time: {
          ...state.status.load_data,
          pending: true,
          err: null,
        },
      },
    }),
  ),
  on(VehiclesActions.loadIdleTimeSuccess,
    (state, { tripId, data }) => ({
      ...state,
      idle_time: {
        ...state.idle_time,
        [tripId]: data,
      },
      status: {
        ...state.status,
        load_idle_time: {
          resolved: true,
          rejected: false,
          pending: false,
          err: null,
        },
      },
    }),
  ),
  on(VehiclesActions.loadIdleTimeFailure,
    (state, { err }) => ({
      ...state,
      status: {
        ...state.status,
        load_idle_time: {
          resolved: false,
          rejected: true,
          pending: false,
          err,
        },
      },
    }),
  ),
  on(VehiclesActions.loadHarshEvents, state => ({
      ...state,
      status: {
        ...state.status,
        load_harsh_events: {
          ...state.status.load_data,
          pending: true,
          err: null,
        },
      },
    }),
  ),
  on(VehiclesActions.loadHarshEventsSuccess,
    (state, { tripId, data }) => ({
      ...state,
      harsh_events: {
        ...state.harsh_events,
        [tripId]: data,
      },
      status: {
        ...state.status,
        load_harsh_events: {
          resolved: true,
          rejected: false,
          pending: false,
          err: null,
        },
      },
    }),
  ),
  on(VehiclesActions.loadHarshEventsFailure,
    (state, { err }) => ({
      ...state,
      status: {
        ...state.status,
        load_harsh_events: {
          resolved: false,
          rejected: true,
          pending: false,
          err,
        },
      },
    }),
  ),
  on(VehiclesActions.loadLongEvents, state => ({
      ...state,
      status: {
        ...state.status,
        load_long_events: {
          ...state.status.load_long_events,
          pending: true,
          err: null,
        },
      },
    }),
  ),
  on(VehiclesActions.loadLongEventsSuccess,
    (state, { tripId, data }) => ({
      ...state,
      long_events: {
        ...state.long_events,
        [tripId]: data,
      },
      status: {
        ...state.status,
        load_long_events: {
          resolved: true,
          rejected: false,
          pending: false,
          err: null,
        },
      },
    }),
  ),
  on(VehiclesActions.loadLongEventsFailure,
    (state, { err }) => ({
      ...state,
      status: {
        ...state.status,
        load_long_events: {
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
