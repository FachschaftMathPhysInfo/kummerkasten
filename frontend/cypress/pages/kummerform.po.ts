export function getLabels() {
  return cy.get('[data-cy^=label-]')
}

export function getAboutText() {
  return cy.get('[data-cy=about-text]').invoke('text')
}