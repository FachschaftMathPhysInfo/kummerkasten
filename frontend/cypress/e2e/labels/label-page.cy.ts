import labels from "../../fixtures/labels.json"
import * as page from "../../pages/labels/label-management.po"
import * as confirmationDialog from "../../pages/confirmation-dialog.po"
import * as kummerform from "../../pages/kummerform.po"
import {UserRole} from "../../../lib/graph/generated/graphql";
import {compareStringsInLowerCase} from "../../../lib/utils";

const roles: UserRole[] = [UserRole.User, UserRole.Admin]
const LABELS_PER_PAGE = 10


describe('Label Management Page Tests', () => {
  roles.forEach((role) => {
    context(`${role} Tests`, () => {
      beforeEach(() => {
        cy.loginAsRole(role)
        cy.visit("/labels")
      })

      it('has a create label button', () => {
        page.getCreateLabelButton().should('be.visible')
      });

      if (role === UserRole.Admin) {
        context('Delete Labels', () => {
          it('opens a confirmation dialog before deleting', () => {
            page.getDeleteButtonsOfLabels(labels.lineare_algebra.name).eq(0).click()

            confirmationDialog.getDialog().should('be.visible')
            confirmationDialog.getTitleText().should('have.length.above', 0)
            confirmationDialog.getDescriptionText().should('contain', labels.lineare_algebra.name)
            confirmationDialog.getCancelButton().should('be.visible')
            confirmationDialog.getConfirmButton().should('be.visible')
          });

          it('does not delete on cancel', () => {
            page.getDeleteButtonsOfLabels(labels.lineare_algebra.name).eq(0).click()
            confirmationDialog.cancel()

            page.getLabelRows().contains(labels.lineare_algebra.name).should('be.visible')
          });

          it('deletes private labels', () => {
            page.deleteLabel(labels.lineare_algebra.name)

            page.getLabelRows().contains(labels.lineare_algebra.name).should('not.exist')
          });

          it('deletes public labels', () => {
            page.deleteLabel(labels.fachschaft.name)

            page.getLabelRows().contains(labels.fachschaft.name).should('not.exist')
            cy.visit("/")
            kummerform.getLabels().contains(labels.fachschaft.name).should('not.exist')

            // CLEANUP
            cy.createLabel(labels.fachschaft)
          })

          after(() => {
            cy.deleteLabels([labels.lineare_algebra.name])
            cy.createLabel(labels.lineare_algebra)
          })
        })
      }

      context('Label Table', () => {
        it('exists', () => {
          page.getLabelTable().should('be.visible')
        });

        it('has a searchbar', () => {
          page.getSearchbar().should('be.visible')
        });

        it('has name sorting button in header', () => {
          page.getSortByNamesButton().should('be.visible')
        })

        it('has label rows', () => {
          page.getLabelRows().should('have.length', LABELS_PER_PAGE)
        });

        it('shows search results if they exist', () => {
          page.search(labels.lineare_algebra.name)
          // Seeds only contain one label 'soziales'
          page.getLabelRows().should('have.length', 1)
          page.getLabelRows().each(($el) => {
            cy.wrap($el).find('td').should('contain.text', labels.lineare_algebra.name)
          })
        });

        it('shows a message if no entries could be found', () => {
          const query = "invalid query"
          page.search(query)
          page.getLabelRows().should('have.length', 0)
          page.getNoResultsMessage().should('be.visible')
        });

        it('has an edit button for every label', () => {
          page.getEditButtonsOfLabels().should('have.length', LABELS_PER_PAGE)
        });

        if (role === UserRole.Admin) {
          it('has a delete button for every label', () => {
            page.getDeleteButtonsOfLabels().should('have.length', LABELS_PER_PAGE)
          });
        } else {
          it('shows no delete actions', () => {
            page.getDeleteButtonsOfLabels().should('not.exist')
          });
        }

        context('Sorting', () => {
          it('sorts names ascending by default', () => {
            let names: string[] = []
            page.getLabelRows().should("have.length.at.least", 2)
            page.getNameCells()
              .each(($el) => names.push($el.text()))
              .then(() => {
                console.log('names: ', names);
                const sorted = [...names].sort(compareStringsInLowerCase)
                console.log('sorted: ', sorted)
                expect(names).to.deep.eq(sorted)
              })
          })

          it('sorts names descending', () => {
            let names: string[] = []
            page.getLabelRows().should("have.length.at.least", 2)
            page.getNameHeader().click()
            page.getNameCells()
              .each(($el) => names.push($el.text()))
              .then(() => {
                const sorted = [...names].sort(compareStringsInLowerCase).reverse()
                expect(names).to.deep.eq(sorted)
              })
          })
        })
      })
    })
  })
})
