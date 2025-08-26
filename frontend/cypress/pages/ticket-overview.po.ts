export function getSearchTitleInput() {
    return cy.get('[data-cy="search-title"]')
}

export function getSearchTextInput() {
    return cy.get('[data-cy="search-text"]')
}

export function getStateFilterButton() {
    return cy.get('[data-cy="button-status"]')
}

export function getLabelFilterButton() {
    return cy.get('[data-cy="button-label"]')
}

export function getSortButton() {
    return cy.get('[data-cy="sort-button"]')
}

export function getSortOrderAsc() {
    return cy.get('[data-cy="sort-order-asc"]')
}

export function getSortOrderDesc() {
    return cy.get('[data-cy="sort-order-desc"]')
}

export function getTicketCard(id: string) {
    return cy.get(`[data-cy="ticket-card-${id}"]`)
}