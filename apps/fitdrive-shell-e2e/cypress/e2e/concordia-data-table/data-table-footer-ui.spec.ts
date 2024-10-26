export function testFooterUI(fixtureName: string, viewport?: Cypress.ViewportPreset): () => void {
    return () => {
      beforeEach(() => {
        if(viewport){
          cy.viewport(viewport);
        }
        cy.loginByApi();
        cy.fixture(fixtureName)
          .as('config');
      });

      it('Should display table paginator correctly', () => {
        cy.get('@config')
          .then((config: any) => cy.visit(`/${config.name}`));

        cy.get('p-paginator[styleclass="p-paginator-bottom"]')
          .as('paginator')
          .then(el => el[0].scrollIntoView());
        cy.get('@paginator')
          .should('exist');
      });

      it('Should display pagination info correctly', ()=> {
        cy.intercept('GET', /\/records/)
          .as('getRecords');

        cy.get('@config')
          .then((config: any) => cy.visit(`/${config.name}`));

        cy.get('p-paginator[styleclass="p-paginator-bottom"]')
          .then(el => el[0].scrollIntoView());

        cy.wait('@getRecords')
          .then((interception) => {
              const { pagination } = interception.response.body;
              const { currentPage, lastPage } = pagination;
              cy.get('p-paginator[styleclass="p-paginator-bottom"]')
                .find('span.p-paginator-current')
                .contains(`${lastPage ? currentPage : 0} of ${lastPage}`);
          });
        });

      it('Should display paginator dropdown options', ()=> {
        cy.get('@config')
          .then((config: any) => cy.visit(`/${config.name}`));

        cy.get('p-dropdown[styleclass="p-paginator-rpp-options"]')
          .as('dropdown')
          .then(el => el[0].scrollIntoView());
        cy.get('@dropdown')
          .should('exist');
      });
    };
}