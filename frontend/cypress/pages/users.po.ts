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

export function getLastnameHeader() {
  return cy.get("[data-cy=lastname-header]")
}

export function getFirstnameHeader() {
  return cy.get("[data-cy=firstname-header]")
}

export function getMailHeader() {
  return cy.get("[data-cy=mail-header]")
}

export function getLastnameCells() {
  return cy.get("[data-cy=lastname-cell]")
}

export function getFirstnameCells() {
  return cy.get("[data-cy=firstname-cell]")
}

export function getMailCells() {
  return cy.get("[data-cy=mail-cell]")
}

export function getActionsOfUsers(mail: string) {
  return cy.get('[data-cy="user-row"]').filter((_, row) => {
    return Cypress.$(row).find('td').filter((_, td) => {
      return Cypress.$(td).text().trim() === mail;
    }).length > 0;
  }).find('[data-cy=action-dropdown]')
}