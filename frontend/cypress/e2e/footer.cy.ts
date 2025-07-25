import * as footer from "../pages/footer.po"
import users from "../fixtures/users.json"

describe('Footer Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should exist on root page', () => {
    cy.visit('/')
    footer.getFooter().scrollIntoView()
    footer.getFooter().should('be.visible')
  })

  it('should exist on login page', () => {
    cy.visit('/login')
    footer.getFooter().scrollIntoView()
    footer.getFooter().should('be.visible')
  })

  it('should have a contacts link', () => {
    footer.getContactLink().should('exist').and('have.attr', 'href')
  });

  it('should have a legal notice link', () => {
    footer.getLegalLink().should('exist').and('have.attr', 'href')
  });

  it('should have a source repo link', () => {
    footer.getGithubLink().should('exist').and('have.attr', 'href')
  });

  it('should not be visible when logged in', () => {
    cy.login(users.admin.mail, users.admin.password)
    cy.visit('/tickets')
    cy.scrollTo("bottom")
    footer.getFooter().should('not.exist')
  })
})
