import { dateToTimestamp, isMobile } from '../../support/utils';

export function testDataTableUI(fixtureName: string, viewport?: Cypress.ViewportPreset): () => void {
  return () => {
    beforeEach(() => {
      if(viewport){
        cy.viewport(viewport);
      }

      cy.loginByApi();
      cy.fixture(fixtureName)
        .as('config');
    });

    it('Should display table headers correctly', () => {
      if(isMobile()){
        return;
      }
      cy.get('@config')
        .then((config: any) => cy.visit(`/${config.name}`));

      cy.getBySel('thHideColumns')
        .should('be.visible');

      cy.getBySel('thSortById')
        .should('be.visible');

      cy.getBySel('thActions')
        .should('be.visible');

      cy.get('@config')
        .then((config: any) => {
          config.columns.forEach(col => {
            cy.getBySel(`th`, col.rowSelector)
              .then(el => el[0].scrollIntoView());

            cy.getBySel(`th`, col.rowSelector)
              .as('column')
              .should('exist');

            cy.get('@column')
              .children('p-sorticon')
              .should('exist');
          });
        });
    });

    it('Should have the correct number of columns', () => {
      const additionalColumns = 3;
      cy.get('@config')
        .then((config: any) => cy.visit(`/${config.name}`));

      cy.get('@config')
        .then((config: any) => {
          cy.get('thead tr th')
            .should('have.length', additionalColumns + config.columns.length);
        });
    });

    it('Should show no data found when response is empty', () => {
      // Mocking empty response
      cy.intercept('GET', /\/records/, { fixture: 'empty-records.json' })
        .as('emptyRecordsRequest');

      cy.get('@config')
        .then((config: any) => cy.visit(`/${config.name}`));

      // Should only have one row
      cy.get('tbody tr').should('have.length', 1);

      // Should display no data found
      cy.getBySel('tdNoData').should('be.visible');
    });

    it('Should display data correctly', () => {
      cy.intercept('GET', /\/records/)
        .as('getRecords');
      cy.get('@config')
        .then((config: any) => cy.visit(`/${config.name}`));

      cy.wait('@getRecords').then((interception) => {
        const data = interception.response.body.data;
        data.forEach((entity) => {
          cy.getBySel(`tr`, entity._id)
            .as('currentRow')
            .should('exist');
          cy.get('@config')
            .then((config: any) => {
              config.columns.forEach(column => {
                //? Drag&Drop case assertion
                cy.getBySel(`trReorder`, entity._id)
                  .then(el => el[0].scrollIntoView());
                cy.getBySel(`trReorder`, entity._id)
                  .should('be.visible');

                if(!isMobile()){
                  //? Checkbox assertion
                  cy.getBySel(`trCheck`, entity._id)
                    .then(el => el[0].scrollIntoView());
                  cy.getBySel(`trCheck`, entity._id)
                    .should('be.visible');
                }

                switch (column.contentType) {
                  case 'string' || 'number':
                    cy.getValueFromSelector(entity, column.rowSelector).then((columnValue) => {
                      if (column.link) {
                        cy.get('@currentRow')
                          .find(`[data-test-id="tdContentLink"][data-cy="${column.rowSelector}"]`)
                          .as('linkCol')
                          .then(el => el[0].scrollIntoView());
                        cy.get('@linkCol')
                          .should('exist');
                        cy.get('@linkCol')
                          .contains(columnValue);
                        return;
                      }
                      cy.get('@currentRow')
                        .find(`[data-test-id="td"][data-cy="${column.rowSelector}"]`)
                        .contains(columnValue);
                    });
                    break;

                  case 'boolean':
                    cy.getValueFromSelector(entity, column.rowSelector).then((columnValue) => {
                      const iconName = columnValue ? 'checkmark-circle-outline' : 'close-circle-outline';
                      cy.get('@currentRow')
                        .find(`td[data-test-id="td"][data-cy="${column.rowSelector}"]`)
                        .find(`ion-icon[data-test-id="tdContentBoolean"][data-cy="${column.rowSelector}"]`)
                        .as('boolIcon')
                        .then(el => el[0].scrollIntoView());
                      cy.get('@boolIcon')
                        .should('exist');
                      cy.get('@boolIcon')
                        .should('have.attr', 'name', iconName);
                    });
                    break;

                  case 'enum':
                    cy.getValueFromSelector(entity, column.rowSelector).then((columnValue) => {
                      cy.get('@currentRow')
                        .find(`td[data-test-id="td"][data-cy="${column.rowSelector}"]`)
                        .find(`ion-chip[data-test-id="tdContentEnum"][data-cy="${column.rowSelector}"]`)
                        .as('enumChip')
                        .then(el => el[0].scrollIntoView());

                      cy.get('@enumChip')
                        .should('exist');
                      cy.get('@enumChip')
                        .contains(columnValue);
                    });
                    break;

                  case 'date':
                    cy.getValueFromSelector(entity, column.rowSelector).then((columnValue) => {
                      cy.get('@currentRow')
                        .find(`td[data-test-id="td"][data-cy="${column.rowSelector}"]`)
                        .as('dateTD');

                      cy.get('@dateTD')
                        .find('ion-text')
                        .as('ionText')
                        .then(el => el[0].scrollIntoView());
                      cy.get('@ionText')
                        .invoke('text')
                        .then((text) => {
                          const date = dateToTimestamp(text);
                          const cellDate = dateToTimestamp(columnValue, true);
                          if (!isNaN(date)) {
                            expect(date).to.be.equal(cellDate);
                            cy.get('@dateTD')
                              .find(`ion-text[data-test-id="tdContentDate"][data-cy="${column.rowSelector}"]`)
                              .should('exist');
                          } else {
                            expect(text).to.be.equal(' n/a ');
                          };
                        });
                    });
                    break;
                  default:
                    break;
                }
              });
            });
        });
      });
    });

    it('Should display actions correctly', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let config: any = {};
      cy.intercept('GET', /\/records/)
        .as('getRecords');

      cy.get('@config')
        .then((c: any) => {
          config = c;
          cy.visit(`/${c.name}`);
        });

      cy.wait('@getRecords')
        .then((interception) => {
          const data = interception.response.body.data;
          data.forEach((entity) => {
            cy.getBySel(`tr`, entity._id)
              .as('currentRow')
              .should('exist');
            config.actions.forEach((action) => {
              cy.get('@currentRow')
                .find(`ion-button[data-test-id="trBtn"][data-cy="${entity._id}-${action.type.toLowerCase()}"]`)
                .as(`${action.type.toLowerCase()}Btn`)
                .then(el => el[0].scrollIntoView());
              cy.get(`@${action.type.toLowerCase()}Btn`)
                .should('be.visible', { setTimeout: 10000 });
            });
            if (!entity.isDeletable) {
              cy.get('@deleteBtn')
                .should('have.attr', 'disabled');
            } else {
              cy.get('@deleteBtn')
                .should('not.have.attr', 'disabled');
            }
            if (!entity.isEditable) {
              cy.get('@editBtn')
                .should('have.attr', 'disabled');
            } else {
              cy.get('@editBtn')
                .should('not.have.attr', 'disabled');
            }
          });
        });
    });
  };
};