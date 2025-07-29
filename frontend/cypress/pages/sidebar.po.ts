export function getLogout() {
    return cy.get('[data-cy="sidebar-logout"]')
}

export function getSettingsButton() {
    return cy.get('[data-cy="sidebar-settings"]')
}