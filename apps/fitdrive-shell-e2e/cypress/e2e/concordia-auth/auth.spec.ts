import { Routes } from '../../fixtures/routes';

export function testAuthContent(): () => void {
  return () => {
    beforeEach(() => {
      cy.visit(Routes.authPage);
      cy.get('form ion-input[data-test-id="username"] input').as(
        'usernameField',
      );
      cy.get('form ion-input[data-test-id="password"] input').as(
        'passwordField',
      );
      cy.get('form ion-button[data-test-id="submit"]').as('submitBtn');
    });

    it('Should display the login form correctly', () => {
      //? Assert the presence of login layout
      cy.assertAuthLayout();
    });

    it.skip('Should redirect to reset', () => {
      cy.get(`form[data-test-id="loginForm"] a[href="/${Routes.resetPage}"]`).click();
      cy.url().should('include', Routes.resetPage);
      cy.visit(Routes.authPage);

      //? Assert form input fields
      cy.get('@usernameField').should('exist');
      cy.get('@passwordField').should('exist');
    });

    it('Should display invalid form inputs', () => {
      //? Enter invalid email address
      cy.get('form[data-test-id="loginForm"] ion-input[data-test-id="username"] .input-bottom .error-text')
        .as('emailErrorField')
        .should('not.be.visible');

      cy.get('@usernameField')
        .type('invalid-email');

      cy.get('@usernameField')
        .blur();

      cy.get('@emailErrorField')
        .should('be.visible');

      //? Enter invalid password
      cy.get('form[data-test-id="loginForm"] ion-input[data-test-id="password"] .input-bottom .error-text')
        .as('passwordErrorField')
        .should('not.be.visible');
      cy.get('@passwordField')
        .type('invalid-password');
      cy.get('@passwordField')
        .blur();
      cy.get('@passwordField')
        .should('be.visible');
    });

    it('Should login fail', () => {
      //? Login call interception
      cy.intercept('POST', /\/token/)
        .as('loginCall');

      //? Fill in invalid form inputs
      cy.login('invalid-email@example.com', 'random-password');

      //? Submit the form
      cy.get('@submitBtn').click({ force: true });

      cy.wait('@loginCall')
        .then((interception)=> expect(interception.response.statusCode).to.equal(422));

      //? Display error toast
      cy.get('div[role="alert"]').should('exist');
    });

    it('Should login successfully login and redirect to endUrl', () => {
      const endUrl = 'drivers';

      cy.clearAllLocalStorage();
      cy.clearAllSessionStorage();

      cy.visit(`${Routes.authPage}?endUrl=%2F${endUrl}`);

      //? Login call interception
      cy.intercept('POST', /\/token/)
        .as('loginCall');

      //? Fill in valid form inputs
      cy.login(Cypress.env('username'), Cypress.env('password'));

      //? Submit the form
      cy.get('@submitBtn').click({ force: true });

      cy.wait('@loginCall')
        .then((interception)=> expect(interception.response.statusCode).to.equal(200));

      //? Redirect to landing
      cy.url().should('include', endUrl);

    });

    it('Should login and logout successfully', () => {
      //? Login call interception
      cy.intercept('POST', /\/token/)
        .as('loginCall');

      //? Fill in valid form inputs
      cy.login(Cypress.env('username'), Cypress.env('password'));

      //? Submit the form
      cy.get('@submitBtn').click();

      cy.wait('@loginCall')
      .then((interception)=> expect(interception.response.statusCode).to.equal(200));

      //? Redirect to landing
      cy.url().should('include', Routes.landingPage);

      //? Select user menu button
      cy.get('ion-button[data-test-id="userMenu"]')
        .as('userMenu')
        .should('exist');
      cy.get('@userMenu').click();

      //? Assert user menu list
      cy.get('ion-list[data-test-id="userMenuList"]')
        .as('userMenuList')
        .should('be.visible');

      //? Assert user menu list items
      cy.get('@userMenuList')
        .find('ion-item')
        .should('have.length', 2);

      //? Check if it contains logout button and click it
      cy.get('@userMenuList')
        .find('ion-item[data-test-id="listLogoutBtn"]')
        .click();

      //? Redirect to landing
      cy.url().should('include', Routes.authPage);

      //? Assert login page layout
      cy.assertAuthLayout();

    });
  };
}
