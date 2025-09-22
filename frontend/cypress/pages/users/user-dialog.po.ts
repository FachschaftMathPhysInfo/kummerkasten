export type UserCreationDialogData = {
  firstname?: string,
  lastname?: string,
  mail?: string,
  password?: string,
  confirmPassword?: string,
}

export function getDialog() {
  return cy.get('[data-cy="user-dialog"]');
}

export function getFirstNameInput() {
  return cy.get('[data-cy=firstname-input]')
}

export function getFirstnameInputMessage() {
  return cy.get('[data-cy=firstname-input-message]')
}

export function getLastNameInput() {
  return cy.get('[data-cy=lastname-input]')
}

export function getLastnameInputMessage() {
  return cy.get('[data-cy=lastname-input-message]')
}

export function getEmailInput() {
  return cy.get('[data-cy=mail-input]')
}

export function getEmailInputMessage() {
  return cy.get('[data-cy=mail-input-message]')
}

export function getPasswordInput() {
  return cy.get('[data-cy=password-input]')
}

export function getPasswordInputMessage() {
  return cy.get('[data-cy=password-input-message]')
}

export function getConfirmPasswordInput() {
  return cy.get('[data-cy=confirm-password-input]')
}

export function getConfirmPasswordInputMessage() {
  return cy.get('[data-cy=confirm-password-input-message]')
}

export function getCancelButton() {
  return cy.get('[data-cy=cancel-button]')
}

export function getSubmitButton() {
  return cy.get('[data-cy=submit-button]')
}

export function fillOutForm(data: UserCreationDialogData) {
  if (data.firstname) getFirstNameInput().type(data.firstname)
  if (data.lastname) getLastNameInput().type(data.lastname)
  if (data.mail) getEmailInput().type(data.mail)
  if (data.password) getPasswordInput().type(data.password)
  if (data.confirmPassword) getConfirmPasswordInput().type(data.confirmPassword)
}

export function cancel() {
  getCancelButton().click()
}

export function submit() {
  getSubmitButton().click()
}