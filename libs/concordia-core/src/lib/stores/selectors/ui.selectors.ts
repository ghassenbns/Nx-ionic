import { createSelector } from '@ngrx/store';

import { selectUiState } from '../reducers';

export const selectShowMenu = createSelector(
  selectUiState,
  state => state.showMenu,
);

export const selectShowRightMenu = createSelector(
    selectUiState,
    state => state.showRightMenu,
);

export const selectShowRightPanel = createSelector(
  selectUiState,
  state => state.showRightPanel,
);

export const selectShowHelpPanel = createSelector(
  selectUiState,
  state => state.showHelpPanel,
);
export const selectShowHelpMenu = createSelector(
  selectUiState,
  state => state.showHelpMenu,
);

export const selectHelpPanel = createSelector(
  selectUiState,
  state => state.helpPanel,
);

export const selectHelpSubPanel = createSelector(
  selectUiState,
  state => state.helpSubPanel,
);

export const selectHelp = createSelector(
  selectUiState,
  state => state.helpMenu,
);

export const selectHelpError = createSelector(
  selectUiState,
  state => state.helpPanelError,
);

export const selectHidePageElement = createSelector(
  selectUiState,
  state => state.hidePageElements,
);
