import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ENVIRONMENT, VERSION } from '../tokens';
import { ConfigService as SuT } from './config.service';

describe('ConfigService', () => {

  const environment = {
    production: false,
    config: {
      apiUrl: 'https//example.com/api-test/',
    },
    authCodeFlowConfig: {
      grantType: 'password',
      tokenEndpoint: 'https://dev.advanticsys.net:9443/auth/token',
      logoutUrl: 'https://dev.advanticsys.net:9443/auth/logout',
      redirectUri: `${window.location.origin}/mfe1`,
      clientId: '2',
      dummyClientSecret: 'c28vyUQtS9nX1gYxLslNidrmvRwwD0tqI5YhNALU',
      responseType: 'code',
      showDebugInformation: true,
      strictDiscoveryDocumentValidation: false,
    },
  };

  const version = '0.1.0-alpha.0';

  let spectator: SpectatorService<SuT>;
  let sut: SuT;

  const createService = createServiceFactory({
    service: SuT,
    providers: [
      { provide: ENVIRONMENT, useValue: environment },
      { provide: VERSION, useValue: version },
    ],
  });

  beforeEach(() => {

    spectator = createService();

    sut = spectator.inject(SuT);

  });

  it('should create', () => {

    expect(sut).toBeTruthy();

  });

});
