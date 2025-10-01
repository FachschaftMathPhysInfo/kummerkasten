export function getTicketsBreadcrumb() {
  return cy.get('[data-cy="ticket-sidebar-breadcrumb"]')
}

export function getTicketDetailSearch() {
  return cy.get('[data-cy="ticket-detail-search"]')
}

export function getTicketDetailFilterButton() {
  return cy.get('[data-cy="ticket-detail-filter-button"]')
}

export function getTicketDetailFilterReset() {
  return cy.get('[data-cy="ticket-detail-reset-filter"]')
}

export function getTicketCard(id: string) {
  return cy.get(`[data-cy="ticket-card-id-${id}"]`)
}

export function getTicketFilterBar() {
  return cy.get('[data-cy="ticket-filter-bar"]')
}