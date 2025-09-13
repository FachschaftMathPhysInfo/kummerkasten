export function getDialog() {
  return cy.get('[data-cy=confirmation-dialog]')
}

export function getTitleText() {
  return cy.get('[data-cy="confirmation-dialog-title"]').invoke('text');
}

export function getDescriptionText() {
  return cy.get('[data-cy="confirmation-dialog-description"]').invoke('text');
}

export function getCancelButton() {
  return cy.get('[data-cy="confirmation-dialog-cancel-button"]');
}

export function getConfirmButton() {
  return cy.get('[data-cy="confirmation-dialog-confirm-button"]');
}

export function cancel() {
  getCancelButton().click();
}

export function confirm() {
  getConfirmButton().click();
}