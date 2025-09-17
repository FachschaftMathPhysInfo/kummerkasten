export function getFooterContactInput() {
  return cy.get('[data-cy="footer-contact-input"]')
}

export function getFooterContactMessage() {
  return cy.get('[data-cy="footer-contact-input-message"]')
}

export function getFooterLegalNoticeInput() {
  return cy.get('[data-cy="footer-legalnotice-input"]')
}

export function getFooterLegalNoticeMessage() {
  return cy.get('[data-cy="footer-legalnotice-input-message"]')
}

export function getFooterCancelButton() {
  return cy.get('[data-cy="footer-cancel-button"]')
}

export function getFooterSaveButton() {
  return cy.get('[data-cy="footer-save-button"]')
}