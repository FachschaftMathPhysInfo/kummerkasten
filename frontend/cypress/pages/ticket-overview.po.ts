import {TicketSortingField} from "@/app/tickets/page";

export function getDesktopSearchTextInput() {
  return cy.get('[data-cy="ticket-overview-search-field"]')
}

export function getMobileFilterButton() {
  return cy.get('[data-cy="mobilte-filter-button"]')
}

export function getMobileOverviewStatusButton() {
  return cy.get('[data-cy="mobile-overview-status-button"]')
}

export function getMobileOverviewStatusButtonNew() {
  return cy.get('[data-cy="mobile-overview-status-New"]')
}

export function getMobileOverviewStatusButtonOpen() {
  return cy.get('[data-cy="mobile-overview-status-Open"]')
}

export function getMobileOverviewStatusButtonClosed() {
  return cy.get('[data-cy="mobile-overview-status-Closed"]')
}

export function getMobileOverviewLabelButton() {
  return cy.get('[data-cy="mobile-overview-label-button"]')
}

export function getMobileOverviewLabelSearch() {
  return cy.get('[data-cy="mobile-overview-label-search"]')
}

export function getMobileOverviewLabel(labelId: string) {
  return cy.get(`[data-cy="mobile-overview-label-${labelId}"]`)
}

export function getMobileOverviewClearLabels() {
  return cy.get('[data-cy="mobile-overview-clear-labels"]')
}

export function getMobileOverviewSortButton() {
  return cy.get('[data-cy="mobile-overview-sort-button"]')
}

export function getMobileOverviewSorting(field: TicketSortingField) {
  return cy.get(`[data-cy="mobile-overview-sorting-${field}"]`)
}

export function getMobileOverviewSortingAscending() {
  return cy.get('[data-cy="mobile-overview-sorting-ascending"]')
}

export function getMobileOverviewSortingDescending() {
  return cy.get('[data-cy="mobile-overview-sorting-descending"]')
}


export function getDesktopOverviewStateFilterButton() {
  return cy.get('[data-cy="desktop-overview-button-status"]')
}

export function getDesktopOverviewStatusButtonNew() {
  return cy.get('[data-cy="desktop-overview-button-New"]')
}

export function getDesktopOverviewStatusButtonOpen() {
  return cy.get('[data-cy="desktop-overview-button-Open"]')
}

export function getDesktopOverviewStatusButtonClosed() {
  return cy.get('[data-cy="desktop-overview-button-Closed"]')
}

export function getDesktopOverviewLabelFilterButton() {
  return cy.get('[data-cy="desktop-overview-button-label"]')
}

export function getDesktopOverviewLabel(labelId: string) {
  return cy.get(`[data-cy="desktop-overview-label-${labelId}"]`)
}

export function getMobileCalendarStartButton() {
  return cy.get('[data-cy="mobile-calendar-start"]')
}

export function getMobileCalendarEndButton() {
  return cy.get('[data-cy="mobile-calendar-end"]')
}

export function getDesktopCalendarStartButton() {
  return cy.get('[data-cy="desktop-calendar-start"]')
}

export function getDesktopCalendarEndButton() {
  return cy.get('[data-cy="desktop-calendar-end"]')
}

export function getSortingSelectionSortButton() {
  return cy.get('[data-cy="sorting-selection-sort-button"]')
}

export function getSortingSelectionSortField(field: TicketSortingField) {
  return cy.get('[data-cy="sorting-selection-sort-${field}"]')
}

export function getDesktopOverviewResetFilters() {
  return cy.get('[data-cy="desktop-overview-reset-filter"]')
}

export function getTicketCard(id: string) {
  return cy.get(`[data-cy="ticket-card-${id}"]`)
}

export function getTicketDeleteCancel() {
  return cy.get('[data-cy="confirmation-cancel')
}

export function getTicketDeleteConfirm() {
  return cy.get('[data-cy="confirmation-delete')
}