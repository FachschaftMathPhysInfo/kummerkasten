export function getFAQTable() {
  return cy.get('[data-cy=faqs-table]');
}

export function getSearchbar() {
  return cy.get('[data-cy="faq-searchbar"]');
}

export function getFAQRows() {
  return cy.get('[data-cy=faq-row]');
}

export function getCreateButton() {
  return cy.get('[data-cy=create-faq-button]');
}

export function getEditButtons() {
  return cy.get('[data-cy^=edit-faq-button]');
}

export function getDeleteButtons() {
  return cy.get('[data-cy^=delete-faq-button]');
}

export function getDndHandles() {
  return cy.get('[data-cy^=drag-handle]');
}