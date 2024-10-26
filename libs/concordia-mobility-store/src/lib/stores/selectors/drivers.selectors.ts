import { createSelector } from '@ngrx/store';

import { selectDriversState } from '../reducers';

export const selectDriversEventsLoadStatusPending = createSelector(
  selectDriversState,
  state => state.status.load_events.pending,
);

export const selectDriversEvents = createSelector(
  selectDriversState,
  state => state.events,
);
