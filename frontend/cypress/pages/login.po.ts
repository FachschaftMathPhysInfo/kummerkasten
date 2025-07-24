export function getPasswordInput() {
  return cy.get('[data-cy="password-input"]')
}

export function getMailInput() {
  return cy.get('[data-cy="mail-input"]')
}

export function getPasswortMessage() {
  return cy.get('[data-cy="password-message"]')
}

export function getMailMessage() {
  return cy.get('[data-cy="mail-message"]')
}

export function getSubmitButton() {
  return cy.get('[data-cy="submit"]')
}

export function submit() {
  getSubmitButton().click()
}

export function login (mail: string, password: string) {
  getMailInput().type(mail)
  getPasswordInput().type(password)
  submit()
}