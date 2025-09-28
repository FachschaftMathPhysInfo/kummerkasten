export type FAQDialogData = {
  question?: string;
  answer?: string;
  position?: number;
}

export function getDialog() {
  return cy.get('[data-cy="faq-dialog"]');
}

export function getQuestionInput() {
  return cy.get('[data-cy="question-input"]');
}

export function getQuestionInputMessage() {
  return cy.get('[data-cy="question-input-message"]');
}

export function getAnswerInput() {
  return cy.get('[data-cy="answer-input"]');
}

export function getAnswerInputMessage() {
  return cy.get('[data-cy="answer-input-message"]');
}

export function getPositionInput() {
  return cy.get('[data-cy="position-input"]');
}

export function getPositionInputMessage() {
  return cy.get('[data-cy="position-input-message"]');
}

export function getCancelButton() {
  return cy.get('[data-cy="cancel-button"]');
}

export function getSubmitButton() {
  return cy.get('[data-cy="submit-button"]');
}

export function fillOut(data: FAQDialogData) {
  if (data.question) getQuestionInput().clear().type(data.question)
  if (data.answer) getAnswerInput().clear().type(data.answer)
  if (data.position) getPositionInput().clear().type(data.position.toString())
}

export function cancel() {
  getCancelButton().click();
}

export function submit() {
  getSubmitButton().click();
}