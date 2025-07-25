export function getCreateUserButton() {
  return cy.get("[data-cy=create-user-button]")
}

export function getSearchbar() {
  return cy.get("[data-cy=user-searchbar]")
}

export function search(query: string) {
  getSearchbar().type(query)
}

export function getNoResultsMessage() {
  return cy.get("[data-cy=no-results-message]")
}

export function getUserTable() {
  return cy.get("[data-cy=user-table]")
}

export function getUserRows() {
  return cy.get("[data-cy=user-row]")
}

export function getActionsOfUsers(mail: string) {
  return cy.get('[data-cy="user-row"]').filter((_, row) => {
    return Cypress.$(row).find('td').filter((_, td) => {
      return Cypress.$(td).text().trim() === mail;
    }).length > 0;
  }).find('[data-cy=action-dropdown]')
}