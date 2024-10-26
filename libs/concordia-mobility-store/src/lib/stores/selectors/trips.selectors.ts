import { createSelector } from '@ngrx/store';

import { selectTripsState } from '../reducers';
import * as fromTripsSelector from '../reducers/trips.reducer';

export const selectTripsEntities = createSelector(
  selectTripsState,
  fromTripsSelector.selectTripsEntities,
);

export const selectTripsIds = createSelector(
  selectTripsState,
  state => state.ids.length ? state.ids : [],
);

export const selectTripLoadStatusPending = createSelector(
  selectTripsState,
  state => state.status.load.pending,
);

export const selectTripEventsLoadStatusPending = createSelector(
  selectTripsState,
  state => state.status.load_events.pending,
);

export const selectTripTrajectoryTime = createSelector(
  selectTripsState,
  state => state.trajectoryTime,
);

export const selectTripChartTime = createSelector(
  selectTripsState,
  state => state.chartTime,
);

export const selectZoomTime = createSelector(
  selectTripsState,
  state => state.zoomTime,
);
