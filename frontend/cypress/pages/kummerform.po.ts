export function getLabels() {
  return cy.get('[data-cy^=label-]')
}