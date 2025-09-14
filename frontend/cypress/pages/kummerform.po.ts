export function getAboutText() {
    return cy.get(`[data-cy="kummerform-about"]`)
}

export function getTitleInput() {
    return cy.get('[data-cy="kummerform-title-input"]')
}
export function getTextInput() {
    return cy.get('[data-cy="kummerform-text-input"]')
}
export function getAllFormLabels() {
    return cy.get(`[data-cy="kummerform-labels"]`)
}
export function getFormLabel(id: string) {
    return cy.get(`[data-cy="kummerform-label-${id}"]`)
}
export function getFormLabelCheckbox(id: string) {
    return cy.get(`[data-cy="kummerform-label-checkbox-${id}"]`)
}
export function getSendButton() {
    return cy.get(`[data-cy="kummerform-send"]`)
}


export function getQAPs(id: string) {
    return cy.get(`[data-cy="kummerform-faq-${id}"]`)   
}
export function getQAPQuestion(id: string) {
    return cy.get(`[data-cy="kummerform-faq-question${id}"]`)   
}
export function getQAPAnswer(id: string) {
    return cy.get(`[data-cy="kummerform-faq-answer${id}"]`)
}
export function QAPEmpty() {
    return cy.get(`[data-cy="kummerform-faq-empty"]`)
}
