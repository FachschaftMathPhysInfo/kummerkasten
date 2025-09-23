export function getTextInput() {
  return cy.get('[data-cy="about-text-input"]')
}

export function getTextInputText() {
  return getTextInput().invoke('text')
}

export function getTextInputMessage() {
  return cy.get('[data-cy="about-text-input-message"]')
}

export function getCancelButton() {
  return cy.get('[data-cy="about-cancel-button"]')
}

export function getSubmitButton() {
  return cy.get('[data-cy="about-submit-button"]')
}

export function cancel() {
  getCancelButton().click()
}

export function submit() {
  getSubmitButton().click()
}