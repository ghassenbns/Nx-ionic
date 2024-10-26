// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    state(state: any): any
    login(email: string, password: string): void;
    loginByApi(username?: string, password?: string): Chainable<Response<any>>;
    assertAuthLayout():void;
    getBySel(dataTestAttribute: string, args?: string): Chainable<JQuery<HTMLElement>>;
    getValueFromSelector(row: any, rowSelector: string) : Chainable<string>;
  }
}

Cypress.Commands.add('getBySel', (selector, argsCy = '') => {
  const dataCyAttribute = argsCy ? `[data-cy="${argsCy}"]` : '';
  return cy.get(`[data-test-id="${selector}"]${dataCyAttribute}`);
});

Cypress.Commands.add('login', (email, password) => {
  cy.get('form ion-input[data-test-id="username"] input')
    .type(email, { log : false, force: true });
  cy.get('form ion-input[data-test-id="password"] input')
    .type(password, { log : false, force: true });
});

Cypress.Commands.add('loginByApi', (username = Cypress.env('username'), password = Cypress.env('password')) => {

  const log = Cypress.log({
    displayName: 'AUTH0 LOGIN',
    message: [`🔐 Authenticating `],
    autoEnd: false,
  });
  log.snapshot('before');

  const args = { username, password };
  const config = {
       client_id: Cypress.env('clientId'),
       client_secret: Cypress.env('dummyClientSecret'),
       scope: Cypress.env('scope'),
       grant_type: Cypress.env('grantType'),
  };
  const headers = { 'Content-Type' : 'application/x-www-form-urlencoded' };
  cy.session(
    `auth-${username}`,
    ()=> {
      cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/auth/token`,
      body: {
        ...args,
        ...config,
      },
      headers,
    })
    .then(({ body }) => {
      const dateNow = Date.now();
      const expiresAt = dateNow  + body.expires_in * 1000;

      window.localStorage.setItem('access_token', body.access_token);
      window.localStorage.setItem('expires_in', body.expires_in);
      window.localStorage.setItem('refresh_token', body.refresh_token);
      window.localStorage.setItem('expires_at', `${expiresAt}`);
      window.localStorage.setItem('access_token_stored_at', `${dateNow}`);

      log.snapshot('after');
      log.end();
    });
    },
  );
});

Cypress.Commands.add('assertAuthLayout', ()=> {
      //? Assert navbar
      cy.get('ion-header[data-test-id="navbar"]')
        .should('not.be.visible');

      //? Assert language switcher
      cy.get('[data-test-id="languageSwitcherContainer"]')
        .should('be.visible');

      //? Assert fitdrive logo
      cy.get('div[data-test-id="fitdriveLogoContainer"]')
        .as('fitdriveLogoContainer')
        .should('exist');

      cy.get('@fitdriveLogoContainer')
        .find('[data-test-id="fitdriveLogo"]')
        .should('be.visible');

      //? Assert login form
      cy.get('form[data-test-id="loginForm"]')
        .as('loginForm')
        .should('be.visible');

      cy.get('@loginForm')
        .find('ion-input')
        .should('have.length', 2);
      // cy.get('form ion-checkbox').should('exist');
      cy.get('@loginForm')
        .find('ion-button[data-test-id="submit"]')
        .should('exist');
      // cy.get('form a[data-test-id="reset"]').should('exist');

      //? Assert form labels
      cy.get('@loginForm')
        .contains('E-Mail Address')
        .should('exist');
      cy.get('@loginForm')
        .contains('Password')
        .should('exist');
      // cy.contains('Remember me').should('exist');
      cy.get('@loginForm')
        .contains('Login')
        .should('exist');
      //? Assert copyright
      cy.get('[data-test-id="copyrightContainer"]')
        .find('ion-img[data-test-id="advanticsysLogo"]')
        .should('be.visible');
});

Cypress.Commands.add('getValueFromSelector', (entity: any, rowSelector: string)=> {
  let propertyValue = entity;
  const selectors = rowSelector.split('.');

  for (const selector of selectors) {
    propertyValue = propertyValue[selector] ?? ' n/a ';
  }
  return propertyValue;
});
