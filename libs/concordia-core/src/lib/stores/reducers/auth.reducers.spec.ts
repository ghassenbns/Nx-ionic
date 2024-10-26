import { HttpErrorResponse } from '@angular/common/http';
import { LoginResponseData } from '@concordia-nx-ionic/concordia-auth-api';
import { Action } from '@ngrx/store';

import * as AuthActions from '../actions/auth.actions';
import { authInitialState, authReducer } from './auth.reducers';

describe('authReducer', () => {
  it('should return the initial state', () => {
    const action = {} as Action;
    const state = authReducer(undefined, action);

    expect(state).toBe(authInitialState);
  });

  it('should handle login', () => {
    const username = 'testuser';
    const password = 'testpassword';
    const action = AuthActions.login({ username, password });
    const state = authReducer(authInitialState, action);

    expect(state).toEqual({
      ...authInitialState,
      status: {
        resolved: false,
        rejected: false,
        pending: true,
        err: null,
      },
    });
  });

  it('should handle loginSuccess', () => {
    const response = { accessToken: 'testtoken' } as LoginResponseData;
    const action = AuthActions.loginSuccess({ response });
    const state = authReducer(authInitialState, action);

    expect(state).toEqual({
      ...authInitialState,
      status: {
        resolved: true,
        rejected: false,
        pending: false,
        err: null,
      },
    });
  });

  it('should handle loginFailure', () => {
    const error = { message: 'test error' } as HttpErrorResponse;
    const action = AuthActions.loginFailure({ error });
    const state = authReducer(authInitialState, action);

    expect(state).toEqual({
      ...authInitialState,
      status: {
        resolved: false,
        rejected: true,
        pending: false,
        err: error,
      },
    });
  });

  it('should handle logout', () => {
    const action = AuthActions.logout({ endUrl: true });
    const state = authReducer(authInitialState, action);

    expect(state).toEqual({
      ...authInitialState,
      status: {
        resolved: false,
        rejected: false,
        pending: false,
        err: null,
      },
    });
  });
});
