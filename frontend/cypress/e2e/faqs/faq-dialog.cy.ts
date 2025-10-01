import {UserRole} from "../../../lib/graph/generated/graphql";
import * as page from "../../pages/faqs/faq-page.po"
import * as dialog from "../../pages/faqs/faq-dialog.po"
import * as confirmationDialog from "../../pages/confirmation-dialog.po"
import * as faqs from "../../fixtures/faqs.json"

const roles: UserRole[] = [UserRole.User, UserRole.Admin]
const AMOUNT_FAQS_SEED_DB = 5

describe('FAQ Manipulation Tests', () => {
  roles.forEach((role) => {
    context(`${role} Tests`, () => {
      beforeEach(() => {
        cy.loginAsRole(role)
        cy.visit('/faq')
      })

      it('has a create button', () => {
        page.getCreateButton().should('be.enabled')
      })

      context('Create FAQs', () => {
        beforeEach(() => page.getCreateButton().click())

        it('shows the whole dialog', () => {
          dialog.getQuestionInput().should('be.visible')
          dialog.getQuestionInputMessage().should('not.exist')
          dialog.getAnswerInput().should('be.visible')
          dialog.getAnswerInputMessage().should('not.exist')
          dialog.getPositionInput().should('have.value', AMOUNT_FAQS_SEED_DB + 1)
          dialog.getPositionInputMessage().should('not.exist')
          dialog.getCancelButton().should('be.enabled')
          dialog.getSubmitButton().should('be.enabled')
        })

        it('closes the dialog on cancel', () => {
          dialog.cancel()

          dialog.getDialog().should('not.exist')
        });

        context('Invalid Form', () => {
          it('shows error on empty question', () => {
            dialog.submit()
            dialog.getQuestionInputMessage().should('be.visible')
          });

          it('shows error on empty answer', () => {
            dialog.submit()
            dialog.getAnswerInputMessage().should('be.visible')
          });

          it('does not allow too long questions', () => {
            const MAX_QUESTION_LENGTH = 100
            const longString = "a".repeat(MAX_QUESTION_LENGTH + 1)
            dialog.getQuestionInput().type(longString, {delay: 0})
            dialog.getQuestionInput().invoke('val').should('have.length', MAX_QUESTION_LENGTH)
          });

          it('does not allow too long answers', () => {
            const MAX_ANSWER_LENGTH = 700
            const longString = "a".repeat(MAX_ANSWER_LENGTH + 1)
            dialog.getAnswerInput().type(longString, {delay: 0})
            dialog.getAnswerInput().invoke('text').should('have.length', MAX_ANSWER_LENGTH)
          });

          it('does not allow non numbers on position', () => {
            dialog.getPositionInput().type("A")
            dialog.submit()

            // Because the input does not accept non numbers
            dialog.getPositionInputMessage().should('not.exist')
          })

          it('does not allow numbers < 1', () => {
            dialog.getPositionInput().clear().type("0")
            dialog.submit()

            dialog.getPositionInputMessage().should('be.visible')
          });

          it('does not allow already used question', () => {
            dialog.fillOut(faqs.first)
            dialog.submit()

            dialog.getQuestionInputMessage().should('be.visible')
          });
        })

        it('should not save on cancel', () => {
          dialog.fillOut(faqs.test)
          dialog.cancel()

          page.getFAQRows().contains(faqs.test.question).should('not.exist')
        });

        it('saves on valid input', () => {
          dialog.fillOut(faqs.test)
          dialog.submit()
          cy.reload()

          page.getFAQRows()
            .eq(faqs.test.position - 1)
            .should('contain.text', faqs.test.question)
            .and('contain.text', faqs.test.answer)
        });

        after(() => cy.deleteFAQ(faqs.test.question))
      })

      context("Edit FAQs", () => {
        beforeEach(() => page.getEditButtons().eq(0).click())

        it('shows the whole dialog', () => {
          dialog.getQuestionInput().should('have.value', faqs.first.question)
          dialog.getAnswerInput().should('have.value', faqs.first.answer)
          dialog.getPositionInput().should('have.value', faqs.first.position)
        })

        it('saves updates to the faq', () => {
          dialog.fillOut(faqs.test)
          dialog.submit()

          page.getFAQRows()
            .eq(faqs.test.position - 1)
            .should('contain.text', faqs.test.question)
            .and('contain.text', faqs.test.answer)
        })

        after(() => {
          cy.deleteFAQ(faqs.test.question)
          cy.createFAQ({...faqs.first, position: faqs.first.position - 1})
        })
      })

      if(role === UserRole.Admin) {
        context("Delete FAQs", () => {
          beforeEach(() => page.getDeleteButtons().eq(0).click())

          it('shows the delete dialog', () => {
            confirmationDialog.getDialog().should('be.visible')
          });

          it('does not delete on cancel', () => {
            confirmationDialog.cancel()

            page.getFAQRows().contains(faqs.first.question).should('be.visible')
          });

          it('deletes faqs', () => {
            confirmationDialog.confirm()
            cy.reload()
            page.getFAQRows().contains(faqs.first.question).should('not.exist')
          })

          after(() => cy.createFAQ({...faqs.first, position: faqs.first.position - 1}))
        })
      }
    })
  })
})