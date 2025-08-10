import users from "../fixtures/users.json"
import * as page from "../pages/users.po"

describe('User Management Page Tests', () => {
  beforeEach(() => {
    cy.login(users.admin.mail, users.admin.password)
    cy.visit("/users")
  })

  it('should have a create user button', () => {
    page.getCreateUserButton().click()
  });

  it('should have a searchbar', () => {
    page.getSearchbar().should('be.visible')
  });

  context('User Table', () => {
    it('should exist', () => {
      page.getUserTable().should('be.visible')
    });

    it('should have user rows', () => {
      // This is the amount of users provided by the dev seed
      page.getUserRows().should('have.length', 6)
    });

    it('should show search results if they exist', () => {
      const query = "kummer"
      page.search(query)
      // There is only one user with last name containing kummer in our seeds
      page.getUserRows().should('have.length', 1)
      page.getUserRows().each(($el) => {
        cy.wrap($el).find('td').should('contain.text', query)
      })
    });

    it('should show a message if no entries could be found', () => {
      const query = "invalid query"
      page.search(query)
      page.getUserRows().should('have.length', 0)
      page.getNoResultsMessage().should('be.visible')
    });

    it('should not allow editing on self', () => {
      page.getActionsOfUsers(users.admin.mail).should('not.exist')
    });
  })

  context('User Table Sorting', () => {
    it('should sort lastnames ascending by default', () => {
      let names: string[] = []
      page.getUserRows().should("have.length.at.least", 2)
      page.getLastnameCells()
        .each(($el) => names.push($el.text()))
        .then(() => {
          const sorted = [...names].sort()
          expect(names).to.deep.eq(sorted)
        })
    })

    it('should sort lastnames descending', () => {
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

    it('should sort firstnames ascending', () => {
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

    it('should sort firstnames descending', () => {
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

    it('should sort mails ascending', () => {
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

    it('should sort mails descending', () => {
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