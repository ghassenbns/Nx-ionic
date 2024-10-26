import { Routes } from '../../fixtures/routes';

export function testResetContent(): () => void {
  return () => {
    beforeEach(() => {
      cy.visit(Routes.resetPage);
      cy.get('form ion-input[data-test-id="usernameReset"] input')
        .as('inputField');
    });
    it('Should display the reset password form correctly', () => {
      //? Assert the presence of form elements
      cy.get('form').should('exist');
      cy.get('form ion-item').should('have.length', 1);
      cy.get('form ion-button[data-test-id="submitReset"]').should('exist');
      cy.get(`form a[data-test-id="backToLogin"]`).should('exist');

      //? Assert form labels
      cy.contains('E-Mail Address').should('exist');
      cy.contains('Send reset password link').should('exist');
      cy.contains('Back to Login').should('exist');

      //? Assert form input field
      cy.get('form ion-input[data-test-id="usernameReset"]').should('exist');
    });

    it('Should display invalid form input', () => {
      cy.get('@inputField')
        .clear();

      cy.get('@inputField')
        .type('invalid-email');

      cy.get('@inputField')
        .blur();
      cy.get('form ion-note[slot="error"]').should('exist');
    });

    it('Should submit the form', () => {
      //? Fill in valid form input
      cy.get('@inputField')
        .clear();
      cy.get('@inputField')
        .type('valid-email@example.com');

      //? Submit the form successfully
      cy.get('form ion-button[data-test-id="submitReset"]').click();
      cy.get('form').should('have.class', 'ng-submitted');
      cy.get('form').should('have.class', 'ng-valid');
    });
  };
}