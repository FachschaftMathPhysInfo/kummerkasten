export function getFirstnameInput() {
    return cy.get('[data-cy="account-firstname-input"]')
}

export function getFirstnameMessage() {
    return cy.get('[data-cy="account-firstname-message"]')
}

export function getLastnameInput() {
    return cy.get('[data-cy="account-lastname-input"]')
}

export function getLastnameMessage() {
    return cy.get('[data-cy="account-lastname-message"]')
}

export function getMailInput() {
    return cy.get('[data-cy="account-mail-input"]')
}

export function getMailMessage() {
    return cy.get('[data-cy="account-mail-message"]')
}

export function getCurrentPasswordInput() {
    return cy.get('[data-cy="account-current-password-input"]')
}

export function getCurrentPasswordMessage() {
    return cy.get('[data-cy="account-current-password-message"]')
}

export function getNewPasswordInput() {
    return cy.get('[data-cy="account-new-password-input"]')
}

export function getNewPasswordMessage() {
    return cy.get('[data-cy="account-new-password-message"]')
}

export function getRepeatedPasswordInput() {
    return cy.get('[data-cy="account-repeated-password-input"]')
}

export function getRepeatedPasswordMessage() {
    return cy.get('[data-cy="account-repeated-password-message"]')
}

export function getProfileSaveButton() {
    return cy.get('[data-cy="input-profile-save"]');
}

export function getPasswordSaveButton() {
    return cy.get('[data-cy="input-settings-save"]');
}




