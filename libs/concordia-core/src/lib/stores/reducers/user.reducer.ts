import {
  UserInterface,
  UserSettingsInterface,
} from '@concordia-nx-ionic/concordia-auth-api';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Status } from '../../interfaces';
import { UserActions } from '../actions';

export const adapter: EntityAdapter<UserInterface> = createEntityAdapter<UserInterface>({
  selectId: a => a.userId,
});

export interface UserState extends EntityState<UserInterface> {
  email: string,
  name: string,
  userId: number | null,
  userLevelId: number | null,
  langEmail: string | null,
  settings: UserSettingsInterface | null,
  status: Status,
}

export const initialState: UserState = adapter.getInitialState({
  email: '',
  name: '',
  userId: null,
  userLevelId: null,
  langEmail: null,
  settings: null,
  status: {
    resolved : false,
    rejected : false,
    err : null,
    pending : false,
  },
}) as any;

export const reducer = createReducer(
  initialState,
  on(UserActions.loadUser,
    UserActions.updateUserInterface,
    state => ({
      ...state,
      status: {
        resolved : false,
        rejected : false,
        err : null,
        pending : true,
      },
    }),
  ),
  on(UserActions.loadUserSuccess,
    (state, { userId, name, email, userLevelId, langEmail,
      settings }) => ({
      ...state,
      userId,
      name,
      email,
      userLevelId,
      langEmail,
      settings,
      status: {
        resolved: true,
        rejected : false,
        err : null,
        pending : false,
      },
    }),
  ),
  on(UserActions.loadUserFailure,
    (state, { err }) => ({
      ...state,
      status: {
        resolved : false,
        rejected : true,
        err : err,
        pending : false,
      },
    }),
  ),
  on(UserActions.addUser,
    (state, { user }) => {
      return adapter.upsertOne(user, state);
    },
  ),
  on(UserActions.clear,
    state => ({
      ...state,
      ...initialState,
    }),
  ),
  on(UserActions.updateUserInterfaceSuccess,
    (state, { settings }) => ({
      ...state,
      settings: {
        localization: settings.localization,
        userInterface: settings.userInterface,
      },
      status: {
        resolved: true,
        rejected : false,
        err : null,
        pending : false,
      },
    }),
  ),
  on(UserActions.loadUserFailure,
    (state, { err }) => ({
      ...state,
      status: {
        resolved : false,
        rejected : true,
        err : err,
        pending : false,
      },
    }),
  ),
);

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectUsers = selectAll;
export const selectUserEntities = selectEntities;
