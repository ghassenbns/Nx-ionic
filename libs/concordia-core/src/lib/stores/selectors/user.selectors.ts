import { UserInterface } from '@concordia-nx-ionic/concordia-auth-api';
import { createSelector } from '@ngrx/store';

import { selectUserState } from '../reducers';
import * as fromUserSelector from '../reducers/user.reducer';

export const selectUserEntities = createSelector(
  selectUserState,
  fromUserSelector.selectUserEntities,
);

export const selectCurrentUserId = createSelector(
  selectUserState,
  state => state.userId,
);

export const selectCurrentUserName = createSelector(
  selectUserState,
  state => state.name,
);

export const selectCurrentUserStatus = createSelector(
  selectUserState,
  state => state.status,
);

export const selectCurrentUserLevelId = createSelector(
  selectUserState,
  state => {
    // console.error('state', state);

    return state.userLevelId;
  },
);

export const selectCurrentUserSettings = createSelector(
  selectUserState,
  state => state.settings,
);

export const selectCurrentUserInterface = createSelector(
  selectCurrentUserSettings,
  state => state?.userInterface,
);

export const selectCurrentUserTheme = createSelector(
  selectCurrentUserInterface,
  state => state?.theme || 'light',
);

export const selectCurrentUserDateTimeFormat = createSelector(
  selectCurrentUserSettings,
  state => state?.localization.dateTimeFormat ?? null,
);

export const selectCurrentUserTZ = createSelector(
  selectCurrentUserSettings,
  state => state?.localization.tz ?? null,
);

export const selectCurrentUserLanguage = createSelector(
  selectCurrentUserSettings,
  state => state?.userInterface.language ?? '',
);

export const selectCurrentUser = createSelector(
  selectCurrentUserId,
  selectUserEntities,
  (id, e) => id && e[id] ? e[id] as UserInterface : null,
);

export const selectDisplayDensity = createSelector(
  selectCurrentUserSettings,
  state => state?.userInterface.displayDensity ?? '',
);

export const selectCurrentUserDecimalSeparator = createSelector(
  selectCurrentUserSettings,
  state => state?.localization.decimalSeparator ?? 'dot',
);

export const selectCurrentUserThousandSeparator = createSelector(
  selectCurrentUserSettings,
  state => state?.localization.thousandSeparator ?? 'none',
);
