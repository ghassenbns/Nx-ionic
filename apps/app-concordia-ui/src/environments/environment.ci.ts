/**
 * CI environment to test build step. not working at the moment!
 */
export const environment = {
  production: true,
  config: {
    apiUrl: 'https://dev.advanticsys.net:9443/dev/concordia/api',
  },
  authCodeFlowConfig: {
    grantType: 'password',
    tokenEndpoint: 'https://dev.advanticsys.net:9443/dev/auth/token',
    logoutEndpoint: 'https://dev.advanticsys.net:9443/dev/auth/logout',
    logoutUrl: 'http://localhost:4301/auth/login',

    // URL of the SPA to redirect the user to after login
    redirectUri: `${window.location.origin}/mfe1`,

    // The SPA's id. The SPA is registerd with this id at the auth-server
    // clientId: 'server.code',
    clientId: '99',
    // Just needed if your auth server demands a secret. In general, this
    // is a sign that the auth server is not configured with SPAs in mind
    // and it might not enforce further best practices vital for security
    // such applications.
    dummyClientSecret: 'pfvlL4iXxxXXxcERCWtAIIcCNCewMCq6CGKQtWhT',

    responseType: 'code',

    // set the scope for the permissions the client should request
    // The first four are defined by OIDC.
    // Important: Request offline_access to get a refresh token
    // The api scope is a usecase specific one
    //scope: 'openid profile email offline_access api',

    showDebugInformation: true,
    strictDiscoveryDocumentValidation: false,
    scope: '*',
  },
  fakeUserName: 'xxxxxxxxx',
  fakePassword: 'xxxxxxxxx',
  customerName: 'xxxxxxxxx',
  customerUrl: 'https://xxxxxxxxx.xxxxxxxxx.xxxxxxxxx/',
};
