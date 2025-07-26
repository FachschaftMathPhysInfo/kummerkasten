import users from "../fixtures/users.json"
import * as loginPage from "../pages/login.po"

describe('Login Tests', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('displays login', () => {
    loginPage.getMailInput().should('be.visible')
    loginPage.getPasswordInput().should('be.visible')
    loginPage.getMailMessage().should('have.length', 0)
    loginPage.getPasswortMessage().should('have.length', 0)
    loginPage.getSubmitButton().should('be.visible').and('not.be.disabled')
  })

  it('should show missing mail message', () => {
    loginPage.submit()
    loginPage.getMailMessage().should('contain.text', "Bitte gib eine gültige E-Mail an.")
  })

  it('should show incorrect mail format message', () => {
    loginPage.getMailInput().type("Invalid Mail")
    loginPage.submit()
    loginPage.getMailMessage().should('contain.text', "Bitte gib eine gültige E-Mail an.")
  })

  it('should show wrong credentials message', () => {
    loginPage.login("test@mail.de", "invalid password")
    loginPage.getPasswortMessage().should('contain.text', "Anmeldedaten inkorrekt")
  })

  it('should log user in',() => {
    const ticketUrl = Cypress.config().baseUrl + '/tickets'
    loginPage.login(users.admin.mail, users.admin.password)
    cy.url().should('eq', ticketUrl)
  })

  it('should redirect logged in users', () => {
    cy.login(users.admin.mail, users.admin.password)
    cy.visit('/login')
    cy.url().should("eq", Cypress.config().baseUrl + '/tickets')
  });
})
