export function getDialog() {
  return cy.get("[data-cy=create-label-dialog]")
}

export function getNameInput() {
  return cy.get("[data-cy=name-input]")
}

export function typeName(text: string) {
  getNameInput().should('be.visible').clear().type(text)
}

export function getNameInputMessage() {
  return cy.get("[data-cy=name-input-message]")
}

export function getColorPicker() {
  return cy.get("[data-cy=color-picker-input]")
}

export function getColorInput() {
  return cy.get("[data-cy=color-input]")
}

export function typeColor(color: string) {
  getColorInput().should('be.visible').clear().type(color)
}

export function getColorInputMessage() {
  return cy.get("[data-cy=color-input-message]")
}

export function getIsPublicCheckbox () {
  return cy.get("[data-cy=public-checkbox]")
}

export function getCancelButton() {
  return cy.get("[data-cy=cancel-button]")
}

export function getSubmitButton() {
  return cy.get("[data-cy=submit-button]")
}

export function fillOutForm(name?: string, color?: string, isPublic = false) {
  if (name) typeName(name)
  if (color) {
    typeColor(color)
  }
  if (isPublic) getIsPublicCheckbox().click()
}

export function cancel() {
  getCancelButton().click()
}

export function submit() {
  getSubmitButton().click()
}