import { createAction, props } from '@ngrx/store';

export const togglePageElement = createAction(
  '[UI] Toggle Page Element',
);

export const toggleMenu = createAction(
  '[UI] Toggle menu',
);

export const toggleRightPanel = createAction(
    '[UI] Toggle right panel',
);

export const toggleRightMenu = createAction(
  '[UI] Toggle right menu',
);

export const toggleHelpMenu = createAction(
  '[UI] Toggle Help menu',
);

export const closeRightMenuPanel = createAction(
  '[UI] Close right menu and panel',
);

export const toggleHelpPanel = createAction(
  '[UI] Toggle Help panel',
);

export const setHelpPage = createAction(
  '[UI] Set Help Page',
  props<{
    page: string;
  }>(),
);
export const setHelpSupPage = createAction(
  '[UI] Set Help Sup Page',
  props<{
    page: string;
  }>(),
);

export const loadHelp = createAction(
  '[UI] load Help Menu',
  props<{
    lang: string;
    page: string;
  }>(),
);

export const loadHelpSuccess = createAction(
  '[UI] load Help Success',
  props<{
    lang: string;
    page: string;
    date: string;
  }>(),
);

export const loadHelpFailure = createAction(
  '[UI] load Help Failure',
);
