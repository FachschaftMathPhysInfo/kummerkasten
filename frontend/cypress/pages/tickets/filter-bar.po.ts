import {TicketSortingField} from "@/app/tickets/page";

export function getDesktopOverviewStateFilterButton() {
  return cy.get('[data-cy="desktop-overview-button-status"]')
}

export function getDesktopOverviewStatusButtonNew() {
  return cy.get('[data-cy="desktop-overview-button-NEW"]')
}

export function getDesktopOverviewStatusButtonOpen() {
  return cy.get('[data-cy="desktop-overview-button-OPEN"]')
}

export function getDesktopOverviewStatusButtonClosed() {
  return cy.get('[data-cy="desktop-overview-button-CLOSED"]')
}

export function getDesktopOverviewStatusFilterSearch(){
  return cy.get('[data-cy="desktop-overview-status-search"]')
}

export function getDesktopOverviewLabelFilterButton() {
  return cy.get('[data-cy="desktop-overview-button-label"]')
}

export function getDesktopOverviewLabel(labelId: string) {
  return cy.get(`[data-cy="label-badge-${labelId}"]`)
}

export function getDesktopOverviewLabelSearch() {
  return cy.get('[data-cy="label-search"]')
}

export function getSortingSelectionSortButton() {
  return cy.get('[data-cy="sorting-selection-sort-button"]')
}

export function getSortingSelectionSortField(field: TicketSortingField) {
  return cy.get(`[data-cy="sorting-selection-sort-${field}"]`)
}

export function getDesktopCalendarStartButton() {
  return cy.get('[data-cy="desktop-calendar-start"]')
}

export function getDesktopCalendarEndButton() {
  return cy.get('[data-cy="desktop-calendar-end"]')
}

export function getStartCalendarReset(){
  return cy.get('[data-cy="start-calendar-reset"]')
}

export function getEndCalendarReset(){
  return cy.get('[data-cy="end-calendar-reset"]')
}

export function getClearLabels(){
  return cy.get('[data-cy="clear-labels"]')
}