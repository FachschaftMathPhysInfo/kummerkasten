import {getClient} from "../../../lib/graph/client";
import {AllLabelsDocument, DeleteLabelsDocument} from "../../../lib/graph/generated/graphql";

export function getCreateLabelButton() {
  return cy.get("[data-cy=create-label-button]")
}

export function getSearchbar() {
  return cy.get("[data-cy=label-searchbar]")
}

export function search(query: string) {
  getSearchbar().type(query)
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
  return cy.get("[data-cy=table-header-button]")
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

export function getEditButtonsOfLabels(name?: string) {
  if (name) {
    return getLabelRows().filter((_, row) => {
      return Cypress.$(row).find('td').filter((_, td) => {
        return Cypress.$(td).text().trim() === name;
      }).length > 0;
    }).find('[data-cy=label-edit-button]')
  } else {
    return cy.get("[data-cy=label-edit-button]")
  }
}

export async function deleteLabels(names: string[]) {
  const client = getClient()
  const data = await client.request(AllLabelsDocument)
  const labelsToDelete = data.labels?.filter(l => !!l &&names.includes(l.name))
  if (labelsToDelete) {
    const idsToDelete = labelsToDelete.filter(l => !!l).map(l => l.id)
    await client.request(DeleteLabelsDocument, {ids: idsToDelete})
  }
}