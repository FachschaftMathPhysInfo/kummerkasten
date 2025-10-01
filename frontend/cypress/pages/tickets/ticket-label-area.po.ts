export function getTicketLabelSettings(){
  return cy.get('[data-cy="label-settings-button"]');
}

export function getLabelSearch(){
  return cy.get('[data-cy="label-settings-search"]');
}

export function getTicketLabel(id: string){
  return cy.get(`[data-cy="label-settings-label-${id}"]`);
}

export function getLabelAreaSave(){
  return cy.get('[data-cy="label-area-save"]');
}