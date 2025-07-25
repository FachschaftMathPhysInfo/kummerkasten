import users from "../fixtures/users.json"
import * as accountPage from "../pages/accountsettings.po"

describe('Profile Settings Page', () => {
    beforeEach(() => {
        cy.login(users.admin.mail, users.admin.password)
        cy.visit("/account")
    })

    it('should load settings page with all fields', () => {
        cy.get('[data-cy="account-firstname-input"]').should('exist');
        cy.get('[data-cy="account-lastname-input"]').should('exist');
        cy.get('[data-cy="account-mail-input"]').should('exist');
        cy.get('[data-cy="input-profile-save"]').should('be.visible').click();
        cy.get('[data-cy="account-current-password-input"]').should('exist');
        cy.get('[data-cy="account-new-password-input"]').should('exist');
        cy.get('[data-cy="account-repeated-password-input"]').should('exist');
        cy.get('[data-cy="input-settings-save"]').should('be.visible').click();
    });

    it('shows validation errors for empty field firstname', () => {
        cy.get('[data-cy="account-firstname-input"]')
            .invoke('val', '')
            .trigger('input');

        cy.get('[data-cy="input-profile-save"]').click();
        accountPage.getFirstnameMessage()
            .scrollIntoView()
            .should('contain', 'Vorname ist erforderlich');
    });

    it('shows validation errors for empty field lastname', () => {
        cy.get('[data-cy="account-lastname-input"]')
            .invoke('val', '')
            .trigger('input');

        cy.get('[data-cy="input-profile-save"]').click();
        accountPage.getLastnameMessage()
            .scrollIntoView()
            .should('contain', 'Nachname ist erforderlich');
    });
});
