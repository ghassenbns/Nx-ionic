import { Status } from '@concordia-nx-ionic/concordia-core';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { MeterActions } from '../actions';

export const adapter: EntityAdapter<any> = createEntityAdapter<any>({
  selectId: a => a._id,
});

export interface MetersState extends EntityState<any> {
  meters: number | null;
  listParam: any;
  latestTariffs: any;
  status: {
    load: Status;
    load_latest_tariff: Status;
    load_list_param: Status;
  };
}

export const initialState: MetersState = adapter.getInitialState({
  meters: null,
  listParam: {},
  latestTariffs: {},
  status: {
    load: {
      pending: false,
      resolved: false,
      rejected: false,
      err: null,
    },
    load_latest_tariff: {
      pending: false,
      resolved: false,
      rejected: false,
      err: null,
    },
    load_list_param: {
      pending: false,
      resolved: false,
      rejected: false,
      err: null,
    },
  },
});

export const reducer = createReducer(
  initialState,
  on(MeterActions.loadMeter, state => ({
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
  on(MeterActions.loadMeterSuccess,
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
  on(MeterActions.loadMeterFailure,
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
  on(MeterActions.addMeter,
    (state, { meter }) => {
      const newMeter = {
        ...meter,
      };

      // uncomment to test segmented button resize in meter detail page
      // newMeter.latestTariffEnabled = true;
      // newMeter.customInfoEnabled = true;
      return adapter.upsertOne(newMeter, state);
    },
  ),
  on(MeterActions.loadMeterLatestTariff, state => ({
      ...state,
      status: {
        ...state.status,
        load_latest_tariff: {
          ...state.status.load_latest_tariff,
          pending: true,
          err: null,
        },
      },
    }),
  ),
  on(MeterActions.loadMeterLatestTariffSuccess, state => ({
      ...state,
      status: {
        ...state.status,
        load_latest_tariff: {
          resolved: true,
          rejected: false,
          pending: false,
          err: null,
        },
      },
    }),
  ),
  on(MeterActions.loadMeterLatestTariffFailure, (state, { err }) => ({
      ...state,
      status: {
        ...state.status,
        load_latest_tariff: {
          resolved: false,
          rejected: true,
          pending: false,
          err,
        },
      },
    }),
  ),
  on(MeterActions.addMeterLatestTariff,
    (state, { id, tariff }) => ({
      ...state,
      latestTariffs: {
        ...state.latestTariffs,
        [id]: { ...tariff },
      },
    }),
  ),
  on(MeterActions.loadMetersListParam, state => ({
      ...state,
      status: {
        ...state.status,
        load_list_param: {
          ...state.status.load,
          pending: true,
          err: null,
        },
      },
    }),
  ),
  on(MeterActions.loadMetersListParamSuccess,
    (state) => ({
      ...state,
      status: {
        ...state.status,
        load_list_param: {
          resolved: true,
          rejected: false,
          pending: false,
          err: null,
        },
      },
    }),
  ),
  on(MeterActions.loadMetersListParamFailure,
    (state, { err }) => ({
      ...state,
      status: {
        ...state.status,
        load_list_param: {
          resolved: false,
          rejected: true,
          pending: false,
          err,
        },
      },
    }),
  ),
  on(MeterActions.addMetersListParam,
    (state, { p, meters }) => ({
      ...state,
      listParam: {
        ...state.listParam,
        ...p.meterIds?.length && {
          [`${p.viewAsUserId}__${p.meterIds.join('_')}`]: meters,
        },
        ...!p.meterIds?.length && {
          [p.viewAsUserId]: meters,
        },
      },
    }),
  ),
);

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectMeters = selectAll;
export const selectMetersEntities = selectEntities;
