import { HttpErrorResponse } from '@angular/common/http';
import { LoginResponseData } from '@concordia-nx-ionic/concordia-auth-api';

import * as AuthActions from '../actions/auth.actions';

describe('Auth Actions', () => {
  it('should create login action', () => {
    const expectedAction = {
      type: AuthActions.AuthActionTypes.LOGIN,
      username: 'user',
      password: 'pass',
    };
    const action = AuthActions.login({ username: 'user', password: 'pass' });
    expect(action).toEqual(expectedAction);
  });

  it('should create login success action', () => {
    const response: LoginResponseData = {
      accessToken: '123456',
      tokenType: 'bearer',
      expiresIn: 56464,
      refreshToken: '123456789',
    };
    const expectedAction = {
      type: AuthActions.AuthActionTypes.LOGIN_SUCCESS,
      response,
    };
    const action = AuthActions.loginSuccess({ response });
    expect(action).toEqual(expectedAction);
  });

  it('should create login failure action', () => {
    const error = new HttpErrorResponse({});
    const expectedAction = {
      type: AuthActions.AuthActionTypes.LOGIN_FAILURE,
      error,
    };
    const action = AuthActions.loginFailure({ error });
    expect(action).toEqual(expectedAction);
  });

  it('should create logout action', () => {
    const expectedAction = {
      endUrl: true,
      type: AuthActions.AuthActionTypes.LOGOUT,
    };
    const action = AuthActions.logout({ endUrl: true });
    expect(action).toEqual(expectedAction);
  });
});
