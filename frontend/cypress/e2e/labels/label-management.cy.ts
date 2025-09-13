import users from "../../fixtures/users.json"
import labels from "../../fixtures/labels.json"
import * as page from "../../pages/labels/label-management.po"
import * as creationDialog from "../../pages/labels/create-label-dialog.po"
import * as confirmationDialog from "../../pages/confirmation-dialog.po"
import * as kummerform from "../../pages/kummerform.po"

describe('Label Management Page Tests', () => {
  beforeEach(() => {
    cy.login(users.cypress.mail, users.cypress.password)
    cy.visit("/labels")
  })

  it('has a create label button', () => {
    page.getCreateLabelButton().should('be.visible')
  });

  context('Create Labels', () => {
    beforeEach(() => {
      page.getCreateLabelButton().click()
    })

    it('shows the whole dialog', () => {
      creationDialog.getDialog().should('be.visible')
      creationDialog.getNameInput().should('be.visible')
      creationDialog.getColorPicker().should('be.visible')
      creationDialog.getColorInput().should('be.visible')
      creationDialog.getIsPublicCheckbox().should('be.visible')
      creationDialog.getCancelButton().should('be.visible')
      creationDialog.getSubmitButton().should('be.visible')
    })

    it('closes on cancel button', () => {
      creationDialog.cancel()

      creationDialog.getDialog().should('not.exist')
    })

    it('shows errors on empty submit', () => {
      creationDialog.submit()

      creationDialog.getNameInputMessage().should('be.visible')
      creationDialog.getColorInputMessage().should('not.exist')
    })

    // FIXME: #279
    it('shows error on already taken name', () => {
      creationDialog.fillOutForm(labels.soziales.name, labels.soziales.color, labels.soziales.public)
      creationDialog.submit()

      creationDialog.getNameInputMessage().should('be.visible')
    });

    it('shows error on invalid hexcode', () => {
      creationDialog.fillOutForm(undefined, "#AE")
      creationDialog.submit()

      creationDialog.getColorInputMessage().should('be.visible')
    });

    it('does not save on cancel', () => {
      creationDialog.fillOutForm(labels.test1.name, labels.test1.color)
      creationDialog.cancel()

      page.getLabelRows().contains('Test Label 1').should('not.exist')
    });

    // FIXME: #280
    it('creates label on valid submit', () => {
      creationDialog.fillOutForm(labels.test1.name, labels.test1.color, labels.test1.public)
      creationDialog.submit()

      creationDialog.getDialog().should('not.exist')
      page.getLabelRows().contains(labels.test1.name).should('be.visible')
    })

    after(() => page.deleteLabelsAPI([labels.test1.name, labels.test2.name]))
  })

  context.only('Delete Labels', () => {
    it('opens a confirmation dialog before deleting', () => {
      page.getDeleteButtonsOfLabels(labels.soziales.name).eq(0).click()

      confirmationDialog.getDialog().should('be.visible')
      confirmationDialog.getTitleText().should('have.length.above', 0)
      confirmationDialog.getDescriptionText().should('contain', labels.soziales.name)
      confirmationDialog.getCancelButton().should('be.visible')
      confirmationDialog.getConfirmButton().should('be.visible')
    });

    it('does not delete on cancel', () => {
      page.getDeleteButtonsOfLabels(labels.soziales.name).eq(0).click()
      confirmationDialog.cancel()

      page.getLabelRows().contains(labels.soziales.name).should('be.visible')
    });

    it('deletes private labels', () => {
      page.deleteLabel(labels.soziales.name)

      page.getLabelRows().contains(labels.soziales.name).should('not.exist')
    });

    it('deletes public labels', () => {
      page.deleteLabel(labels.fachschaft.name)

      page.getLabelRows().contains(labels.fachschaft.name).should('not.exist')
      cy.visit("/")
      kummerform.getLabels().contains(labels.fachschaft.name).should('not.exist')
    })

    after(() => {
      page.createLabelAPI(labels.soziales)
      page.createLabelAPI(labels.fachschaft)
    })
  })

  context('Label Table', () => {
    it('exists', () => {
      page.getLabelTable().should('be.visible')
    });

    it('has a searchbar', () => {
      page.getSearchbar().should('be.visible')
    });

    it('has label rows', () => {
      const LABELS_IN_DB_SEED = 8
      page.getLabelRows().should('have.length', LABELS_IN_DB_SEED)
    });

    it('shows search results if they exist', () => {
      page.search(labels.soziales.name)
      // Seeds only contain one label 'soziales'
      page.getLabelRows().should('have.length', 1)
      page.getLabelRows().each(($el) => {
        cy.wrap($el).find('td').should('contain.text', labels.soziales.name)
      })
    });

    it('shows a message if no entries could be found', () => {
      const query = "invalid query"
      page.search(query)
      page.getLabelRows().should('have.length', 0)
      page.getNoResultsMessage().should('be.visible')
    });

    it('has an edit button for every label', () => {
      page.getEditButtonsOfLabels().should('have.length', 8)
    });

    it('has a delete button for every label', () => {
      page.getDeleteButtonsOfLabels().should('have.length', 8)
    });

    context('Sorting', () => {
      it('sorts names ascending by default', () => {
        let names: string[] = []
        page.getLabelRows().should("have.length.at.least", 2)
        page.getNameCells()
          .each(($el) => names.push($el.text()))
          .then(() => {
            const sorted = [...names].sort()
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
            const sorted = [...names].sort().reverse()
            expect(names).to.deep.eq(sorted)
          })
      })
    })
  })
})