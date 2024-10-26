import { HttpErrorResponse } from '@angular/common/http';
import { UserInterface, UserSettingsInterface } from '@concordia-nx-ionic/concordia-auth-api';
import { createAction, props } from '@ngrx/store';

export const loadUser = createAction(
  '[USER] Load User',
);

export const addUser = createAction(
  '[USER] Add User',
  props<{
    user: UserInterface;
  }>(),
);

export const loadUserSuccess = createAction(
  '[USER] Load Success',
  props<{
    userId: number;
    name: string;
    email: string;
    userLevelId: number;
    langEmail: string;
    settings: UserSettingsInterface;
  }>(),
);

export const loadUserFailure = createAction(
  '[USER] Load Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);

export const clear = createAction(
  '[USER] Clear User',
);

export const updateUserInterface = createAction(
  '[USER] Update User Interface',
  props<{
    userId: number;
    theme: string;
  }>(),
);

export const updateUserInterfaceSuccess = createAction(
  '[USER] Add User Interface Success',
  props<{
    settings: any;
  }>(),
);

export const updateUserInterfaceFailure = createAction(
  '[USER] Add User Interface Failure',
  props<{
    err: HttpErrorResponse;
  }>(),
);
