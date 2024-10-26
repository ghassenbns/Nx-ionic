import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthApiService, LoginResponseData } from '@concordia-nx-ionic/concordia-auth-api';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { OAuthService } from 'angular-oauth2-oidc';
import { from, Observable, of, throwError } from 'rxjs';

import * as AuthActions from '../actions/auth.actions';
import { AppState } from '../reducers/app.reducer';
import { AppStateService } from '../states/index';
import { AuthEffects } from './auth.effects';

describe('AuthEffects', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;
  let authApiService: AuthApiService;
  let store: Store<AppState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        AuthEffects,
        AppStateService,
        provideMockActions(() => actions$),
        {
          provide: AuthApiService,
          useValue: {
            login: jest.fn(),
            logout: jest.fn(),
          },
        },
        {
          provide: AppStateService,
          useValue: {
            clean: jest.fn(),
          },
        },
        {
          provide: OAuthService,
          useValue: {
            select: jest.fn(),
          },
        },
        {
          provide: Store,
          useValue: {
            select: jest.fn(),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{ id: 1 }]),
          },
        },
      ],
    });

    effects = TestBed.inject(AuthEffects);
    authApiService = TestBed.inject(AuthApiService);
    store = TestBed.inject(Store);
  });

  describe('login$', () => {
    it('should return a LOGIN_SUCCESS action on successful login', () => {
      const loginResponse = {
        access_token: 'test-token',
        refresh_token: 'test-refresh-token',
        expires_in: 1234,
        token_type: 'Bearer',
      };

      const action = AuthActions.login({
        username: 'test-username',
        password: 'test-password',
      });
      const response = new LoginResponseData(loginResponse);

      expect(store).toBeTruthy();
      jest.spyOn(authApiService, 'login').mockReturnValue(of(loginResponse));
      actions$ = of(action);

      effects.login$.subscribe((resultAction:any) => {
        expect(resultAction).toEqual(AuthActions.loginSuccess({ response }));
      });
    });

    it('should return a LOGIN_FAILURE action on failed login', () => {
      const action = AuthActions.login({
        username: 'test-username',
        password: 'test-password',
      });
      const errorResponse = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });

      jest
        .spyOn(authApiService, 'login')
        .mockReturnValue(throwError(errorResponse));
      actions$ = of(action);

      effects.login$.subscribe((resultAction: any) => {
        expect(resultAction).toEqual(
          AuthActions.loginFailure({ error: errorResponse }),
        );
      });
    });
  });

  describe('logout$', () => {
    it('should return a successful logout', () => {
      const action = AuthActions.logout({ endUrl: false });
      jest.spyOn(authApiService, 'logout').mockReturnValue(of(null));
      actions$ = of(action);

      effects.logout$.subscribe((resultAction: any) => {
        expect(resultAction).toEqual(AuthActions.logout);
      });
    });
  });
});
