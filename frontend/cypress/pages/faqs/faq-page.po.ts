export function getFAQTable() {
  return cy.get('[data-cy=faqs-table]');
}

export function getFAQRows() {
  return cy.get('[data-cy=faq-row]');
}

export function getCreateButton() {
  return cy.get('[data-cy=create-faq-button]');
}

export function getEditButton() {
  return cy.get('[data-cy^=edit-faq-button]');
}

export function getDeleteButton() {
  return cy.get('[data-cy^=delete-faq-button]');
}

export function getDndHandle() {
  return cy.get('[data-cy^=drag-handle]');
}