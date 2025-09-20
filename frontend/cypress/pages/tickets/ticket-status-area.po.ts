export function getTicketStatusArea(){
  return cy.get('[data-cy="ticket-status-area"]');
}

export function getTicketStatusClosed(){
  return cy.get('[data-cy="ticket-status-closed"]');
}

export function getTicketStatusNew(){
  return cy.get('[data-cy="ticket-status-new"]');
}

export function getTicketStatusOpen(){
  return cy.get('[data-cy="ticket-status-open"]');
}