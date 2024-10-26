import { createSelector } from '@ngrx/store';

import { selectVehiclesState } from '../reducers';

export const selectVehiclesData = createSelector(
  selectVehiclesState,
  state => state.data,
);

export const selectVehiclesSignalTypes = createSelector(
  selectVehiclesState,
  state => state.signalTypes,
);

export const selectVehiclesPositions = createSelector(
  selectVehiclesState,
  state => state.positions,
);

export const selectVehiclesEvents = createSelector(
  selectVehiclesState,
  state => state.events,
);

export const selectVehiclesSignalTypesLoadStatusPending = createSelector(
  selectVehiclesState,
  state => state.status.load_groups.pending,
);

export const selectVehiclesDataLoadStatusPending = createSelector(
  selectVehiclesState,
  state => state.status.load_data.pending,
);

export const selectVehiclesEventsLoadStatusPending = createSelector(
  selectVehiclesState,
  state => state.status.load_events.pending,
);

export const selectVehiclesPositionsLoadStatusPending = createSelector(
  selectVehiclesState,
  state => state.status.load_positions.pending,
);

export const selectVehiclesIdleTime = createSelector(
  selectVehiclesState,
  state => state.idle_time,
);

export const selectVehiclesIdleTimeStatusPending = createSelector(
  selectVehiclesState,
  state => state.status.load_idle_time.pending,
);

export const selectVehiclesHarshEvents = createSelector(
  selectVehiclesState,
  state => state.harsh_events,
);

export const selectVehiclesHarshEventsStatusPending = createSelector(
  selectVehiclesState,
  state => state.status.load_harsh_events.pending,
);

export const selectVehiclesLongEvents = createSelector(
  selectVehiclesState,
  state => state.long_events,
);

export const selectVehiclesLongEventsStatusPending = createSelector(
  selectVehiclesState,
  state => state.status.load_long_events.pending,
);
