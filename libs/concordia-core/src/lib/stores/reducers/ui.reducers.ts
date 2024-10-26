import { createReducer, on } from '@ngrx/store';

import * as UiActions from '../actions/ui.actions';
import { adapter } from './user.reducer';

export interface UiState {
  showMenu: boolean;
  showRightMenu: boolean;
  showRightPanel: boolean;
  showHelpPanel: boolean;
  showHelpMenu: boolean;
  helpPanel: string;
  helpSubPanel: string;
  helpMenu: any;
  helpPanelError: boolean,
  hidePageElements: boolean,
}

export const authInitialState: UiState = {
  showMenu: true,
  showRightMenu: false,
  showRightPanel: true,
  showHelpPanel: false,
  showHelpMenu: false,
  helpPanel: 'home',
  helpSubPanel: '',
  helpMenu: {
    en: {},
    es: {},
  },
  helpPanelError: false,
  hidePageElements: false,
};

export const authReducer = createReducer(
  authInitialState,
  on(UiActions.toggleMenu, (state) => ({
    ...state,
    showMenu: !state.showMenu,
  })),
  on(UiActions.toggleRightMenu, (state) => ({
    ...state,
    showRightMenu: !state.showRightMenu,
    showRightPanel: false,
  })),
  on(UiActions.toggleRightPanel, (state) => ({
    ...state,
    showRightMenu: false,
    showRightPanel: !state.showRightPanel,
  })),
  on(UiActions.toggleHelpPanel, (state) => ({
    ...state,
    showHelpPanel: !state.showHelpPanel,
    showHelpMenu: false,
  })),
  on(UiActions.toggleHelpMenu, (state) => ({
    ...state,
    showHelpMenu: !state.showHelpMenu,
  })),
  on(UiActions.closeRightMenuPanel, (state) => ({
    ...state,
    showHelpPanel: false,
    showHelpMenu: false,
  })),
  on(UiActions.setHelpPage, (state, { page }) => ({
    ...state,
    helpPanel: page,
  })),
  on(UiActions.setHelpSupPage, (state, { page }) => ({
    ...state,
    helpSubPanel: page,
  })),

  on(UiActions.loadHelpSuccess, (state,  { lang, page, date }) => {
    return {
      ...state,
      helpPanelError: false,
      helpMenu: {
        ...state.helpMenu,
        [lang]: {
          ...state.helpMenu[lang],
          [page]: date,
        },
      },
    };
  }),
  on(UiActions.loadHelpFailure, (state) => ({
    ...state,
    helpPanelError: true,
  })),
  on(UiActions.togglePageElement, (state) => ({
    ...state,
    hidePageElements: !state.hidePageElements,
  })),
);

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectUi = selectAll;
export const selectUiEntities = selectEntities;
