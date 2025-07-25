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
})