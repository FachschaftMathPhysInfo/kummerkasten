export function getEditTicketStatusbar(){
  return cy.get(`[data-cy="edit-ticket-statusbar"]`);
}

export function getCopyLinkStatusbar(){
  return cy.get(`[data-cy="copy-link-statusbar"]`);
}

export function getDeleteTicketStatusbar(){
  return cy.get(`[data-cy="delete-ticket-statusbar"]`);
}