import { getDeviceType, isMobile } from '../../support/utils';

export function testFiltersUI(fixtureName : string, viewport?: Cypress.ViewportPreset): () => void {
    return () => {
      beforeEach(() => {
        if(viewport){
          cy.viewport(viewport);
        }
        cy.loginByApi();
        cy.fixture(fixtureName)
          .as('config')
          .then((config)=>
            cy.visit(`/${config.name}`),
          );
      });

      it('Should display table filters container', ()=> {
        cy.getBySel(`tableFilters${getDeviceType()}Container`)
          .should('be.visible');
      });

      it('Should display table filters buttons correctly', ()=> {
        if(!isMobile()){
          cy.getBySel('tableSelectAllCheckbox')
            .should('be.visible');
          cy.getBySel('tableMultiEditMenu')
            .should('be.visible');
        } else{
          cy.getBySel('showHideColumnMobile')
            .should('be.visible');
        }
        cy.getBySel(`tableFiltersBtn${getDeviceType()}`)
          .as('toggleFilters')
          .should('be.visible');
        cy.getBySel(`tableAddNewEntity${getDeviceType()}`)
          .should('be.visible');
      });

      it('Should display table filters correctly', () => {
        cy.getBySel(`filters${getDeviceType()}`)
          .should('not.exist');
        cy.getBySel(`tableFiltersBtn${getDeviceType()}`)
          .as('toggleFilters')
          .click({ force : true });
        cy.getBySel(`filters${getDeviceType()}`)
          .as('filtersRow')
          .should('exist');

        cy.fixture(fixtureName)
          .then((config)=> {
            config.columns.forEach(c => {
              switch(c.searchType){
                case 'text':
                  cy.getBySel(`tableFilterInput${getDeviceType()}`, c.rowSelector)
                    .should('exist');
                  break;
                case 'select':
                  cy.getBySel(`tableFilterSelect${getDeviceType()}`, c.rowSelector)
                    .should('exist');
                  break;
                case 'selectSearch':
                  cy.getBySel(`tableFilterSelectSearch${getDeviceType()}`, c.rowSelector)
                    .should('exist');
                  break;
                case 'multiSelect':
                  cy.getBySel(`tableFilterMultiSelect${getDeviceType()}`, c.rowSelector)
                    .should('exist');
                  break;
                case 'multiSelectSearch':
                  if(isMobile()) {
                    break;
                  }
                  cy.getBySel(`tableFilterMultiSelectSearch${getDeviceType()}`, c.rowSelector)
                    .should('be.visible');
                  break;
                case 'date':
                  if(isMobile()) {
                    break;
                  }
                  cy.getBySel(`tableFilterDatePicker${getDeviceType()}`, c.rowSelector)
                    .should('be.visible');
                  break;
                default:
                  break;
              }
            });
          });

        cy.get('@toggleFilters')
          .click({ force : true });
        cy.getBySel('@filtersRow')
          .should('not.exist');
      });
    };
  }