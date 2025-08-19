export function getFirstnameInput() {
    return cy.get('[data-cy="account-firstname-input"]')
}

export function getFirstnameMessage() {
    return cy.get('[data-cy="account-firstname-input-message"]')
}

export function getLastnameInput() {
    return cy.get('[data-cy="account-lastname-input"]')
}

export function getLastnameMessage() {
    return cy.get('[data-cy="account-lastname-input-message"]')
}

export function getMailInput() {
    return cy.get('[data-cy="account-mail-input"]')
}

export function getMailMessage() {
    return cy.get('[data-cy="account-mail-input-message"]')
}

export function getCurrentPasswordInput() {
    return cy.get('[data-cy="account-current-password-input"]')
}

export function getCurrentPasswordMessage() {
    return cy.get('[data-cy="account-current-password-input-message"]')
}

export function getNewPasswordInput() {
    return cy.get('[data-cy="account-new-password-input"]')
}

export function getNewPasswordMessage() {
    return cy.get('[data-cy="account-new-password-input-message"]')
}

export function getConfirmPasswordInput() {
    return cy.get('[data-cy="account-confirm-password-input"]')
}

export function getConfirmPasswordMessage() {
    return cy.get('[data-cy="account-confirm-password-input-message"]')
}

export function getProfileSaveButton() {
    return cy.get('[data-cy="input-profile-save"]');
}

export function getPasswordSaveButton() {
    return cy.get('[data-cy="input-settings-save"]');
}




