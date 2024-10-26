import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from '@concordia-nx-ionic/concordia-config';
import { OAuthModule } from 'angular-oauth2-oidc';

import { LoginResponseDataInterface } from '../models';
import { AuthApiService } from './auth-api.service';

class Config {
  settings = {
    production: false,
    config: {
      apiUrl: 'https//example.com/api-test/',
    },
    authCodeFlowConfig: {
      grantType: 'password',
      tokenEndpoint: 'https://dev.advanticsys.net:9443/auth/token',
      logoutEndpoint: 'https://dev.advanticsys.net:9443/auth/logout',
      logoutUrl: 'http://localhost:4300/auth/login',
      redirectUri: `${window.location.origin}/mfe1`,
      clientId: '2',
      dummyClientSecret: 'c28vyUQtS9nX1gYxLslNidrmvRwwD0tqI5YhNALU',
      responseType: 'code',
      showDebugInformation: true,
      strictDiscoveryDocumentValidation: false,
    },
  };

  getEnvironment(): any {
    return { ...this.settings };
  }
}

describe('AuthApiService', () => {
  let service: AuthApiService;
  let config: ConfigService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OAuthModule.forRoot()],
      providers: [
        AuthApiService,
        { provide: ConfigService, useClass: Config },
      ],
      schemas:[NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(AuthApiService);
    config = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('login', () => {
    const username = 'testuser';
    const password = 'testpass';

    it('should return an observable of LoginResponseDataInterface', () => {
      jest.spyOn(console, 'debug').mockImplementation();
      jest.clearAllMocks();

      const expectedResponse: LoginResponseDataInterface = {
        access_token: '1234',
        expires_in: 123456789,
        token_type: 'Bearer',
        refresh_token: '1234',
      };

      service.login(username, password).subscribe(response => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpMock.expectOne(config.getEnvironment().authCodeFlowConfig.tokenEndpoint);
      expect(req.request.method).toBe('POST');
      req.flush(expectedResponse);
    });

    it('should throw an error when login fails', () => {
      jest.spyOn(console, 'error').mockImplementation();
      jest.clearAllMocks();

      const errorMessage = 'Invalid credentials';
      const errorStatus = 401;

      service.login(username, password).subscribe({
        next: () => fail('Login should have failed with an error'),
        error: error => {
          expect(error.status).toBe(errorStatus);
          expect(error.message).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(config.getEnvironment().authCodeFlowConfig.tokenEndpoint);

      expect(req.request.method).toBe('POST');
      req.flush(errorMessage, {
        status: errorStatus,
        statusText: 'Unauthorized',
      });
    });
  });

  describe('logout', () => {
    it('should return an observable of any type', () => {
      service.logout().subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(config.getEnvironment().authCodeFlowConfig.logoutEndpoint);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });
});
