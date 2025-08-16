export function getConfirmDeleteButton() {
    return cy.get('[data-cy="confirm-delete"]')
}

export function getCancelDeleteButton() {
    return cy.get('[data-cy="cancel-delete"]')
}

export function getSearchTicketDetail(){
    return cy.get('[data-cy="search-ticket-detail"]')
}

export function getTicketCardById(id: string) {
    return cy.get(`[data-cy="ticket-card-${id}"]`);
}

export function getTicketStatusBadge(id: string) {
    return cy.get(`[data-cy="ticket-status-${id}"]`);
}

export function getTicketTitle(id: string) {
    return cy.get(`[data-cy="ticket-title-${id}"]`);
}

export function getCopyLinkButton() {
    return cy.get('[data-cy="copy-link-statusbar"]');
}

export function getEditTicketButton() {
    return cy.get('[data-cy="edit-ticket"]');
}

export function getDeleteTicketButton() {
    return cy.get('[data-cy="delete-ticket-statusbar"]');
}

export function getExitTicketButton() {
    return cy.get('[data-cy="exit-ticket"]');
}

export function getTicketStatusBadgeDetail() {
    return cy.get('[data-cy="ticket-status-badge-detail"]');
}

export function getTicketLabel(id: string) {
    return cy.get(`[data-cy="ticket-label-${id}"]`);
}