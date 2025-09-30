import * as confirmationDialog from "../confirmation-dialog.po"

export type LabelDialogData = {
  name: string,
  color: string,
  public: boolean,
}

export function getCreateLabelButton() {
  return cy.get("[data-cy=create-label-button]")
}

export function getSearchbar() {
  return cy.get("[data-cy=label-searchbar]")
}

export function search(query: string) {
  getSearchbar().type(query)
}

export function getSortByNamesButton() {
  return cy.get("[data-cy=table-header-button]")
}

export function getNoResultsMessage() {
  return cy.get("[data-cy=no-results-message]")
}

export function getLabelTable() {
  return cy.get("[data-cy=label-table]")
}

export function getLabelRows() {
  return cy.get("[data-cy=label-row]")
}

export function getNameHeader() {
  return cy.get("[data-cy=table-header-button]").eq(1)
}

export function getNameCells() {
  return cy.get("[data-cy=label-name-cell]")
}

export function getDeleteButtonsOfLabels(name?: string) {
  if (name) {
    return getLabelRows().filter((_, row) => {
      return Cypress.$(row).find('td').filter((_, td) => {
        return Cypress.$(td).text().trim() === name;
      }).length > 0;
    }).find('[data-cy=label-delete-button]')
  } else {
    return cy.get("[data-cy=label-delete-button]")
  }
}

export function deleteLabel(name: string) {
  getDeleteButtonsOfLabels(name).eq(0).click()
  confirmationDialog.confirm();
}

export function getEditButtonsOfLabels(name?: string) {
  if (name) {
    return getLabelRows().filter((_, row) => {
      const labelText = Cypress.$(row).find('[data-cy=label-name-cell]').text().trim();
      return labelText === name;
    }).find('[data-cy=label-edit-button]');
  } else {
    return cy.get("[data-cy=label-edit-button]");
  }
}

export function openEditOfLabel(name: string) {
  getEditButtonsOfLabels(name).eq(0).click()
}