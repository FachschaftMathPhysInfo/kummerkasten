import users from "../../fixtures/users.json"
import * as page from "../../pages/users/user-management.po"
import {UserRole} from "../../../lib/graph/generated/graphql";

describe('User Management Page Tests', () => {
  beforeEach(() => {
    cy.loginAsRole(UserRole.Admin)
    cy.visit("/users")
  })

  it('shows a searchbar', () => {
    page.getSearchbar().should('be.visible')
  });

  it('shows a create user button', () => {
    page.getCreateUserButton().should('be.visible')
  });

  context('User Table - Visual Tests', () => {
    it('exists', () => {
      page.getUserTable().should('be.visible')
    });

    it('has user rows', () => {
      const AMOUNT_USERS_IN_SEEDED_DB = 7
      page.getUserRows().should('have.length', AMOUNT_USERS_IN_SEEDED_DB)
    });

    it('shows search results if they exist', () => {
      const query = "kummer"
      page.search(query)
      // There is only one user with last name containing kummer in our seeds
      page.getUserRows().should('have.length', 1)
      page.getUserRows().each(($el) => {
        cy.wrap($el).find('td').should('contain.text', query)
      })
    });

    it('shows a message if no entries could be found', () => {
      const query = "invalid query"
      page.search(query)
      page.getUserRows().should('have.length', 0)
      page.getNoResultsMessage().should('be.visible')
    });

    it('does not allow editing on self', () => {
      page.getActionsOfUsers(users.cypress.mail).should('not.exist')
    });
  })

  context('User Table - Sorting', () => {
    it('sorts lastnames ascending by default', () => {
      let names: string[] = []
      page.getUserRows().should("have.length.at.least", 2)
      page.getLastnameCells()
        .each(($el) => names.push($el.text()))
        .then(() => {
          const sorted = [...names].sort()
          expect(names).to.deep.eq(sorted)
        })
    })

    it('sorts lastnames descending', () => {
      let names: string[] = []
      page.getUserRows().should("have.length.at.least", 2)
      page.getLastnameHeader().click()
      page.getLastnameCells()
        .each(($el) => names.push($el.text()))
        .then(() => {
          const sorted = [...names].sort().reverse()
          expect(names).to.deep.eq(sorted)
        })
    })

    it('sorts firstnames ascending', () => {
      let names: string[] = []
      page.getUserRows().should("have.length.at.least", 2)
      page.getFirstnameHeader().click()
      page.getFirstnameCells()
        .each(($el) => names.push($el.text()))
        .then(() => {
          const sorted = [...names].sort()
          expect(names).to.deep.eq(sorted)
        })
    })

    it('sorts firstnames descending', () => {
      let names: string[] = []
      page.getUserRows().should("have.length.at.least", 2)
      page.getFirstnameHeader().click()
      page.getFirstnameHeader().click()
      page.getFirstnameCells()
        .each(($el) => names.push($el.text()))
        .then(() => {
          const sorted = [...names].sort().reverse()
          expect(names).to.deep.eq(sorted)
        })
    })

    it('sorts mails ascending', () => {
      let names: string[] = []
      page.getUserRows().should("have.length.at.least", 2)
      page.getMailHeader().click()
      page.getMailCells()
        .each(($el) => names.push($el.text()))
        .then(() => {
          const sorted = [...names].sort()
          expect(names).to.deep.eq(sorted)
        })
    })

    it('sorts mails descending', () => {
      let names: string[] = []
      page.getUserRows().should("have.length.at.least", 2)
      page.getMailHeader().click()
      page.getMailHeader().click()
      page.getMailCells()
        .each(($el) => names.push($el.text()))
        .then(() => {
          const sorted = [...names].sort().reverse()
          expect(names).to.deep.eq(sorted)
        })
    })
  })
})