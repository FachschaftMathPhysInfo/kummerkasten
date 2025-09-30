import * as page from "../../pages/users/user-management.po"
import * as dialog from "../../pages/users/user-dialog.po"
import users from "../../fixtures/users.json"
import {UserRole} from "../../../lib/graph/generated/graphql";

describe('Create User Tests', () => {
  beforeEach(() => {
    cy.loginAsRole(UserRole.Admin)
    cy.visit('/users')
    page.getCreateUserButton().click()
  })

  it('opens dialog on click', () => {
    dialog.getDialog().should('be.visible')
  });

  it('closes on clicking cancel', () => {
    dialog.cancel()
    dialog.getDialog().should('not.exist')
  });

  it('disables no buttons', () => {
    dialog.getCancelButton().should('not.be.disabled')
    dialog.getSubmitButton().should('not.be.disabled')
  });

  context('Create User Form', () => {
    it('shows the complete form', () => {
      dialog.getFirstNameInput().should('be.visible')
      dialog.getLastNameInput().should('be.visible')
      dialog.getEmailInput().should('be.visible')
      dialog.getPasswordInput().should('be.visible')
      dialog.getConfirmPasswordInput().should('be.visible')
      dialog.getCancelButton().should('be.visible')
      dialog.getSubmitButton().should('be.visible')
    })

    it('shows no error on empty form - no submit', () => {
      dialog.getFirstnameInputMessage().should('not.exist')
      dialog.getLastnameInputMessage().should('not.exist')
      dialog.getEmailInputMessage().should('not.exist')
      dialog.getPasswordInputMessage().should('not.exist')
      dialog.getConfirmPasswordInputMessage().should('not.exist')
    });

    it('shows error and disables submit on invalid submit - empty form', () => {
      dialog.submit()

      dialog.getFirstnameInputMessage().should('be.visible').and('have.length.above', 0)
      dialog.getLastnameInputMessage().should('be.visible').and('have.length.above', 0)
      dialog.getEmailInputMessage().should('be.visible').and('have.length.above', 0)
      dialog.getPasswordInputMessage().should('be.visible').and('have.length.above', 0)

      dialog.getSubmitButton().should('be.disabled')
    });

    it('shows error and disables submit on invalid submit - short firstname', () => {
      dialog.fillOutForm({firstname: "a"})
      dialog.submit()

      dialog.getFirstnameInputMessage().should('be.visible').and('have.length.above', 0)
    });

    it('shows error and disables submit on invalid submit - short lastname', () => {
      dialog.fillOutForm({lastname: "a"})
      dialog.submit()

      dialog.getLastnameInputMessage().should('be.visible').and('have.length.above', 0)
    });

    it('shows error and disables submit on invalid submit - invalid mail format', () => {
      dialog.fillOutForm({mail: "a"})
      dialog.submit()

      dialog.getEmailInputMessage().should('be.visible').and('have.length.above', 0)
    });

    it('shows error and disables submit on invalid submit - mail taken', () => {
      dialog.fillOutForm({
        firstname: users.temp.firstname,
        lastname: users.temp.lastname,
        mail: users.fsles1.mail,
        password: users.temp.password,
        confirmPassword: users.temp.password,
      })
      dialog.submit()

      dialog.getEmailInputMessage().should('be.visible').and('have.length.above', 0)
    });

    it('shows error and disables submit on invalid submit - password short', () => {
      dialog.fillOutForm({password: "a"})
      dialog.submit()

      dialog.getPasswordInputMessage().should('be.visible').and('have.length.above', 0)
    });

    it('shows error and disables submit on invalid submit - password no number', () => {
      dialog.fillOutForm({password: "aaaaaaaaaAaaaaaaaa!"})
      dialog.submit()

      dialog.getPasswordInputMessage().should('be.visible').and('have.length.above', 0)
    });

    it('shows error and disables submit on invalid submit - password no capital letter', () => {
      dialog.fillOutForm({password: "aaaaaaaaa2aaaaaaaa!"})
      dialog.submit()

      dialog.getPasswordInputMessage().should('be.visible').and('have.length.above', 0)
    });

    it('shows error and disables submit on invalid submit - password no symbol', () => {
      dialog.fillOutForm({password: "aaaaaaaaa2aaaaaaaaA"})
      dialog.submit()

      dialog.getPasswordInputMessage().should('be.visible').and('have.length.above', 0)
    });

    it('shows error and disables submit on invalid submit - password no lower letter', () => {
      dialog.fillOutForm({password: "AAAAAAAAAAA!123AAAAAA"})
      dialog.submit()

      dialog.getPasswordInputMessage().should('be.visible').and('have.length.above', 0)
    });

    it('shows error and disables submit on invalid submit - confirm password not same', () => {
      dialog.fillOutForm({password: "ThisIsForTesting123!", confirmPassword: "ThisIsForTesting!123"})
      dialog.submit()

      dialog.getConfirmPasswordInputMessage().should('be.visible').and('have.length.above', 0)
    });

    it('creates no user on cancel', () => {
      dialog.fillOutForm({...users.temp, confirmPassword: users.temp.password})
      dialog.cancel()

      dialog.getDialog().should('not.exist')
      page.getUserRows().contains('td', users.temp.mail).should('not.exist')
    });

    it('closes and creates user on valid submision', () => {
      dialog.fillOutForm({...users.temp, confirmPassword: users.temp.password})
      dialog.submit()

      dialog.getDialog().should('not.exist')
      page.getUserRows().contains('td', users.temp.mail).should('be.visible')

      cy.getUserIdByMail(users.temp.mail).should('have.length.above', 0)
    });

    after(() => {
      cy.deleteUser(users.temp.mail)
    })
  })
})
