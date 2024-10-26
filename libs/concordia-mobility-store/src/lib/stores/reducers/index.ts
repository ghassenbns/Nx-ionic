import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromDriversReducer from './drivers.reducer';
import * as fromTripsReducer from './trips.reducer';
import * as fromVehiclesReducer from './vehicles.reducer';

export const featureName = 'concordia-feature-trips';

export interface DocumentsState {
  trips: fromTripsReducer.DocumentState;
  drivers: fromDriversReducer.DocumentState;
  vehicles: fromVehiclesReducer.DocumentState;
}

export function reducers(state: DocumentsState | undefined, action: Action): DocumentsState {
  return combineReducers({
    trips: fromTripsReducer.reducer,
    drivers: fromDriversReducer.reducer,
    vehicles: fromVehiclesReducer.reducer,
  })(state, action);
}

export const selectTripsFeature = createFeatureSelector<DocumentsState>(featureName);

export const selectTripsState = createSelector(selectTripsFeature, state => state.trips);
export const selectDriversState = createSelector(selectTripsFeature, state => state.drivers);
export const selectVehiclesState = createSelector(selectTripsFeature, state => state.vehicles);
