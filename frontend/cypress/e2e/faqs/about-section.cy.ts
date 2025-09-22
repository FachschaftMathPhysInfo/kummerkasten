import {UserRole} from "../../../lib/graph/generated/graphql";
import * as page from "../../pages/faqs/about-page.po"
import * as kummerform from "../../pages/kummerform.po"

const roles: UserRole[] = [UserRole.User, UserRole.Admin]
let currentAboutText: string

describe('About Section Tests', () => {
  before(() => cy.getAboutText().then(text => currentAboutText = text))

  roles.forEach(role => {
    beforeEach(() => {
      cy.loginAsRole(role)
      cy.visit('/faq')
    })

    context(`${role} Tests`, () => {
      it('shows about section form', () => {
        page.getTextInput().should('be.visible')
        page.getTextInputText().should('eq', currentAboutText)
        page.getTextInputMessage().should('not.exist')
        page.getCancelButton().should('be.disabled')
        page.getSubmitButton().should('be.disabled')

      });

      it('enables buttons on change', () => {
        page.getTextInput().type('a')

        page.getCancelButton().should('be.enabled')
        page.getSubmitButton().should('be.enabled')
      });

      context('invalid form', () => {
        it('does not allow to set empty about texts', () => {
          page.getTextInput().clear()
          page.submit()

          page.getTextInputMessage().should('be.visible')
          page.getCancelButton().should('be.enabled')
          page.getSubmitButton().should('be.disabled')
        });

        it('does not allow too long inputs', () => {
          const MAX_LENGTH_TEXT = 2000
          const longString = "a".repeat(MAX_LENGTH_TEXT + 3)
          page.getTextInput().clear().type(longString, {delay: 0})
          page.getTextInput().invoke('text').should('have.length', MAX_LENGTH_TEXT)
        });
      })

      it('resets on cancel', () => {
        page.getTextInput().clear().type('lululu')
        page.cancel()

        page.getTextInputText().should('eq', currentAboutText)
        page.getCancelButton().should('be.disabled')
        page.getSubmitButton().should('be.disabled')

        cy.visit('/')
        kummerform.getAboutText().should('eq', currentAboutText)
      })

      it('saves valid text', () => {
        const newText = "Ich bin ein neuer Text"
        page.getTextInput().clear().type(newText)
        page.submit()

        page.getSubmitButton().should('be.disabled')
        page.getCancelButton().should('be.disabled')
        page.getTextInputText().should('eq', newText)

        cy.visit('/')
        kummerform.getAboutText().should('eq', newText)
      });

      after(() => cy.updateAboutText(currentAboutText))
    })
  })
})