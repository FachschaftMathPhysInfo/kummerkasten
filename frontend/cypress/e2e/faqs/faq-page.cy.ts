import * as page from "../../pages/faqs/faq-page.po"
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
        page.getFAQRows().should('have.length', AMOUNT_FAQ_SEED_DB)
        page.getEditButtons().should('have.length', AMOUNT_FAQ_SEED_DB)
        page.getDndHandles().should('have.length', AMOUNT_FAQ_SEED_DB)
        if (role === UserRole.Admin) page.getDeleteButtons().should('have.length', AMOUNT_FAQ_SEED_DB)
        // FIXME: #353
        else page.getDeleteButtons().should('not.exist')
      });
    })
  })
})