import { HttpErrorResponse } from '@angular/common/http';
import { LoginRequestData, LoginResponseData } from '@concordia-nx-ionic/concordia-auth-api';
import { createAction, props } from '@ngrx/store';

export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',
  LOGOUT = '[Auth] Logout'
}

export const login = createAction(
  AuthActionTypes.LOGIN,
  props<LoginRequestData>(),
);

export const loginSuccess = createAction(
  AuthActionTypes.LOGIN_SUCCESS,
  props<{ response: LoginResponseData }>(),
);

export const loginFailure = createAction(
  AuthActionTypes.LOGIN_FAILURE,
  props<{ error: HttpErrorResponse }>(),
);

export const logout = createAction(
  AuthActionTypes.LOGOUT,
  props<{ endUrl: boolean }>(),
);
