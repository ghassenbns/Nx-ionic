import { createSelector } from '@ngrx/store';

import { selectHierarchiesState } from '../reducers';
import * as fromHierarchiesSelector from '../reducers/hierarchies.reducer';

export const selectHierarchiesEntities = createSelector(
  selectHierarchiesState,
  fromHierarchiesSelector.selectHierarchiesEntities,
);

export const selectHierarchiesLoadPending = createSelector(
  selectHierarchiesState,
  state => state.status.load.pending,
);

export const selectSelectedHierarchies = createSelector(
  selectHierarchiesState,
  state => state.selected,
);

export const selectHierarchiesList = createSelector(
  selectHierarchiesState,
  state => state.hierarchiesList,
);

export const selectHierarchiesListPending = createSelector(
  selectHierarchiesState,
  state => state.status.load_list.pending,
);
