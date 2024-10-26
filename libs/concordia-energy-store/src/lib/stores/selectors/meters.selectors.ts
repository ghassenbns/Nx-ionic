import { createSelector } from '@ngrx/store';

import { selectMetersState } from '../reducers';
import * as fromMetersSelector from '../reducers/meters.reducer';

export const selectMetersEntities = createSelector(
  selectMetersState,
  fromMetersSelector.selectMetersEntities,
);

export const selectMetersLatestTariffs = createSelector(
  selectMetersState,
  state => state.latestTariffs,
);

export const selectMetersIds = createSelector(
  selectMetersState,
  state => state.ids.length ? state.ids : [],
);

export const selectMeterLoadStatusPending = createSelector(
  selectMetersState,
  state => state.status.load.pending,
);

export const selectMeterLatestTariffLoadStatusPending = createSelector(
  selectMetersState,
  state => state.status.load_latest_tariff.pending,
);

export const selectMetersList = createSelector(
  selectMetersState,
  state => state.listParam,
);
