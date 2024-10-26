export const environment = {
  production: false,
  config: {
    apiUrl: 'https://dev.advanticsys.net:9443/dev/concordia/api',
  },
  authCodeFlowConfig: {
    grantType: 'password',
    tokenEndpoint: 'https://dev.advanticsys.net:9443/dev/auth/token',
    logoutEndpoint: 'https://dev.advanticsys.net:9443/dev/auth/logout',
    logoutUrl: 'http://localhost:4301/auth/login',

    // URL of the SPA to redirect the user to after login
    redirectUri: `${window.location.origin}/auth`,

    // The SPA's id. The SPA is registerd with this id at the auth-server
    // clientId: 'server.code',
    clientId: '6',
    // Just needed if your auth server demands a secret. In general, this
    // is a sign that the auth server is not configured with SPAs in mind
    // and it might not enforce further best practices vital for security
    // such applications.
    dummyClientSecret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',

    responseType: 'code',

    // set the scope for the permissions the client should request
    // The first four are defined by OIDC.
    // Important: Request offline_access to get a refresh token
    // The api scope is a usecase specific one
    //scope: 'openid profile email offline_access api',

    showDebugInformation: true,
    strictDiscoveryDocumentValidation: false,
    //removing the scope setting makes the oauth service
    //send the predefined scopes that are meaningless in concordia context
    //keep it as empty string
    scope: '',

  },
  customerName: 'Concordia',
  customerUrl: '',
  loginPageSlider: true,
  loginPageBackgroundFormat: 'jpg',
  // https://openrouteservice.org/
  orsToken: '5b3ce3597851110001cf624848bf3aca54f14b249edf0ca3ff59a14e',
  // https://cloud.maptiler.com/maps/openstreetmap/
  // Use vector style
  mapStyle: 'https://api.maptiler.com/maps/openstreetmap/style.json?key=APPvcxqpVi8UBensUr1l',
  mapDarkStyle: 'https://api.maptiler.com/maps/59da2298-0346-4ae8-b576-c74e7f36f674/style.json?key=4y3IkftfMC2cjQ4t8k4n',
  helpPanel: true,
};
