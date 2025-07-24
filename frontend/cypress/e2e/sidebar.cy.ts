/// <reference types="cypress" />
import * as sidebar from "../pages/sidebar.po"
import {getFooter} from "@/cypress/pages/footer.po";
import users from "../fixtures/users.json"

describe('Footer Tests', () => {

  it('should not be visible on root page', () => {
    cy.visit('/')
    sidebar.getSidebar().should('not.exist')
  });

  it('should not be visible on login page', () => {
    cy.visit('/login')
    sidebar.getSidebar().should('not.exist')
  });

  context('logged in as admin', () => {
    before(() => {
      cy.login(users.admin.mail, users.admin.password)
    })

    beforeEach(() => {
      cy.visit('/tickets')
    })

    it('should exist when logged in', () => {
      sidebar.getSidebar().should('be.visible')
    });

    it('should have tickets link', () => {
      sidebar.getTicketsButton().should("be.visible");
    });

    it('should have labels link', () => {
      sidebar.getLabelsButton().should("be.visible");
    });

    it('should have users link', () => {
      sidebar.getUsersButton().should("be.visible");
    });

    it('should have settings link', () => {
      sidebar.getSettingsButton().should("be.visible");
    });

    it('should have logout button', () => {
      sidebar.getLogout().should("be.visible");
    });

    it('should logout when clicking logout', () => {
      sidebar.getLogout().click()
      cy.url().should('contain', '/login');
      sidebar.getSidebar().should('not.exist')
      getFooter().should('be.visible')
    });
  })

  // TOOD: add base user tests
})
