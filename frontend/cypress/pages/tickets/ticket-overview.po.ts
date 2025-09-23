import {TicketSortingField} from "@/app/tickets/page";
import {TicketState} from "@/lib/graph/generated/graphql";

export function getTodaySuffixForCalendar () {
  const today = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  };

  const formatted = today.toLocaleDateString('en-US', options);

  const day = today.getDate();
  const suffix =
    day % 10 === 1 && day !== 11 ? 'st' :
      day % 10 === 2 && day !== 12 ? 'nd' :
        day % 10 === 3 && day !== 13 ? 'rd' : 'th';

  return formatted.replace(/\d+/, `${day}${suffix}`);
}

export function getTodayCalendarLabel() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = String(today.getFullYear()).slice(-2);

  return `${day}.${month}.${year}`;
}

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
  return cy.get('[data-cy="mobile-overview-status-NEW"]')
}

export function getMobileOverviewStatusButtonOpen() {
  return cy.get('[data-cy="mobile-overview-status-OPEN"]')
}

export function getMobileOverviewStatusButtonClosed() {
  return cy.get('[data-cy="mobile-overview-status-CLOSED"]')
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

export function getMobileCalendarStartButton() {
  return cy.get('[data-cy="mobile-calendar-start"]')
}

export function getMobileCalendarEndButton() {
  return cy.get('[data-cy="mobile-calendar-end"]')
}

export function getDesktopOverviewResetFilters() {
  return cy.get('[data-cy="desktop-overview-reset-filters"]')
}

export function getTicketCard(id: string) {
    return cy.get(`[data-cy="ticket-card-${id}"]`)
}

export function checkTicketExistence(title: string) {
  return cy.get(`[data-cy="ticket-card-title-${title}"]`);
}

export function getTicketCardState(state: TicketState){
  return cy.get(`[data-cy="ticket-card-state-${state}"]`)
}

export function getTicketCardLabel(name: string){
  return cy.get(`[data-cy="ticket-card-label-${name}"]`)
}

export function getTicketCardDropdown(id: string){
  return cy.get(`[data-cy="ticket-card-dropdown-${id}"]`)
}

export function getTicketCardChanged(name: string){
  return cy.get(`[data-cy="ticket-card-${name}"]`)
}

export function getTicketCardCopyButton(id: string) {
  return cy.get(`[data-cy="ticket-card-copy-${id}"]`);
}

export function getTicketCardDeleteButton(id: string) {
  return cy.get(`[data-cy="ticket-card-delete-${id}"]`);
}

export function getTicketDeleteCancel() {
  return cy.get('[data-cy="confirmation-dialog-cancel-button"]')
}

export function getTicketDeleteConfirm() {
  return cy.get('[data-cy="confirmation-dialog-confirm-button"]');
}
