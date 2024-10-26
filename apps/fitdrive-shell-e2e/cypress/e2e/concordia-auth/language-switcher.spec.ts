import { Routes } from '../../fixtures/routes';

export function testLanguageSwitcher(): () => void {
  return () => {
    beforeEach(() => {
      cy.visit(Routes.authPage);
    });

    it('Should display the language switcher correctly', () => {
      cy.get('[data-test-id="languageSwitcherContainer"]')
        .as('languageSwitcherContainer')
        .should('exist');
      cy.get('@languageSwitcherContainer')
        .find('[data-test-id="languageSwitcherSelect"]')
        .as('languageSwitcherSelect')
        .should('be.visible');

      cy.get('@languageSwitcherSelect')
        .should('have.value', 'en');

      cy.get('@languageSwitcherSelect')
        .find('ion-select-option')
        .should('have.length', 2);
      cy.get('@languageSwitcherSelect')
        .find('ion-select-option')
        .eq(0)
        .should('have.value', 'en');

      cy.get('@languageSwitcherSelect')
        .find('ion-select-option')
        .eq(1)
        .should('have.value', 'es');
    });

    it('Should emit language when clicked', () => {
      const selectedLanguage = 'Español';
      //? opens ion-select dropdown
      cy.get('ion-select[data-test-id="languageSwitcherSelect"]')
        .as('languageSwitcherSelect')
        .should('have.value', 'en');
      cy.get('@languageSwitcherSelect')
        .click('center', { force : true });

      cy.get('ion-popover')
        .should('be.visible');

      //? updates language
      cy.get('ion-select-popover')
        .find('ion-radio')
        .contains(selectedLanguage)
        .parent()
        .click();

      cy.get('@languageSwitcherSelect')
        .should('have.value', 'es');
    });
  };
}
