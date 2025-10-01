import * as page from "../../pages/faqs/faq-page.po"
import faqs from "../../fixtures/faqs.json"
import {UserRole} from "../../../lib/graph/generated/graphql";

const roles: UserRole[] = [UserRole.User, UserRole.Admin]
const AMOUNT_FAQ_SEED_DB = 5

describe('FAQ Table Tests', () => {
  roles.forEach((role) => {
    context(`${role} Tests`, () => {
      beforeEach(() => {
        cy.loginAsRole(role)
        cy.visit('/faq')
      })

      it('should show table', () => {
        page.getFAQTable().should('be.visible')
        page.getSearchbar().should('be.visible')
        page.getFAQRows().should('have.length', AMOUNT_FAQ_SEED_DB)
        page.getEditButtons().should('have.length', AMOUNT_FAQ_SEED_DB)
        page.getDndHandles().should('have.length', AMOUNT_FAQ_SEED_DB)
        if (role === UserRole.Admin) page.getDeleteButtons().should('have.length', AMOUNT_FAQ_SEED_DB)
        else page.getDeleteButtons().should('not.exist')
      });

      it('searches in question-field', () => {
        page.getSearchbar().type(faqs.first.question)
        page.getFAQRows().should('have.length', 1)
        page.getFAQRows().eq(0).should('contain.text', faqs.first.question)
      })

      it('searches in answer-field', () => {
        page.getSearchbar().type(faqs.second.answer)
        page.getFAQRows().should('have.length', 1)
        page.getFAQRows().eq(0).should('contain.text', faqs.second.answer)
      })
    })
  })
})