import { createSelector } from '@ngrx/store';

import { selectVersionsState } from '../reducers';

export const selectVersion = createSelector(
  selectVersionsState,
  state => state.semver,
);
