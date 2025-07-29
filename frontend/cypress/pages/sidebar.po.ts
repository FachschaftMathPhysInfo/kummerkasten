export function getSidebar() {
  return cy.get('[data-cy=sidebar]');
}

export function getTicketsButton() {
  return cy.get('[data-cy="sidebar-tickets')
}

export function getLabelsButton() {
  return cy.get('[data-cy="sidebar-labels"]')
}

export function getUsersButton() {
  return cy.get('[data-cy="sidebar-users"]')
}

export function getThemeToggle() {
  return cy.get('[data-cy="sidebar-theme-toggle"]'
  )
}

export function getSettingsButton() {
  return cy.get('[data-cy="sidebar-settings"]')
}

export function getLogout() {
  return cy.get('[data-cy="sidebar-logout"]')
}

export function getSidebarTrigger() {
  return cy.get('[data-cy="sidebar-trigger"]')
}