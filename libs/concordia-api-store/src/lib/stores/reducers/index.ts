import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromTimezonesReducer from './timezone.reducer';

export const featureName = 'concordia-feature-versions';

export interface ApiStoreState {
  timezone: fromTimezonesReducer.TimezonesState;
}

export function reducers(state: ApiStoreState | undefined, action: Action): ApiStoreState {
  return combineReducers({
    timezone: fromTimezonesReducer.reducer,
  })(state, action);
}

export const selectApiStoreFeature = createFeatureSelector<ApiStoreState>(featureName);

export const selectTimezonesState = createSelector(selectApiStoreFeature, state => state.timezone);
