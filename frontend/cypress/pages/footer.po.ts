export function getFooter() {
  return cy.get('[data-cy=footer]')
}

export function getContactLink() {
  return cy.get('[data-cy=footer-contact]')
}

export function getLegalLink() {
  return cy.get('[data-cy=footer-legal]')
}

export function getGithubLink() {
  return cy.get('[data-cy=footer-github]')
}