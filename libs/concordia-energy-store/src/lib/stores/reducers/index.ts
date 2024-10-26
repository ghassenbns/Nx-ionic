import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromHierarchiesReducer from './hierarchies.reducer';
import * as fromMetersReducer from './meters.reducer';

export const featureName = 'concordia-feature-energy';

export interface EnergyState {
  meters: fromMetersReducer.MetersState;
  hierarchies: fromHierarchiesReducer.HierarchiesState;
}

export function reducers(state: EnergyState | undefined, action: Action): EnergyState {
  return combineReducers({
    meters: fromMetersReducer.reducer,
    hierarchies: fromHierarchiesReducer.reducer,
  })(state, action);
}
export const selectMetersFeature = createFeatureSelector<EnergyState>(featureName);

export const selectMetersState = createSelector(selectMetersFeature, state => state.meters);
export const selectHierarchiesState = createSelector(selectMetersFeature, state => state.hierarchies);
