import { createSelector } from '@ngrx/store';

import { selectAuthState } from '../reducers';
import { AuthState } from '../reducers/auth.reducers';

export const selectAuth = createSelector(
  selectAuthState,
  (state: AuthState) => state,
);

export const selectAuthStatus = createSelector(
  selectAuth,
  (state: AuthState) => state.status,
);
