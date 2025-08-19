import users from "../fixtures/users.json"
import * as page from "../pages/label-management.po"

describe('User Management Page Tests', () => {
  beforeEach(() => {
    cy.login(users.admin.mail, users.admin.password)
    cy.visit("/labels")
  })

  it('should have a create label button', () => {
    page.getCreateUserButton().click()
  });

  it('should have a searchbar', () => {
    page.getSearchbar().should('be.visible')
  });

  context('Label Table', () => {
    it('should exist', () => {
      page.getLabelTable().should('be.visible')
    });

    it('should have label rows', () => {
      // This is the amount of labels provided by the dev seed
      page.getLabelRows().should('have.length', 8)
    });

    it('should show search results if they exist', () => {
      const query = "Soziales"
      page.search(query)
      // Seeds only contain one label 'soziales'
      page.getLabelRows().should('have.length', 1)
      page.getLabelRows().each(($el) => {
        cy.wrap($el).find('td').should('contain.text', query)
      })
    });

    it('should show a message if no entries could be found', () => {
      const query = "invalid query"
      page.search(query)
      page.getLabelRows().should('have.length', 0)
      page.getNoResultsMessage().should('be.visible')
    });

    it('should have an edit button for every label', () => {
      page.getEditButtonsOfLabels().should('have.length', 8)
    });

    it('should have a delete button for every label', () => {
      page.getDeleteButtonsOfLabels().should('have.length', 8)
    });
  })

  context('Label Table Sorting', () => {
    it('should sort names ascending by default', () => {
      let names: string[] = []
      page.getLabelRows().should("have.length.at.least", 2)
      page.getNameCells()
        .each(($el) => names.push($el.text()))
        .then(() => {
          const sorted = [...names].sort()
          expect(names).to.deep.eq(sorted)
        })
    })

    it('should sort names descending', () => {
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