export type KummerFormData = {
  formLabelArray?: any[];
  formLabelVal?: boolean[];
  title?: string;
  text?: string;
};

export function getKummerAboutText() {
  return cy.get(`[data-cy=kummerform-about]`);
}

export function getAboutText() {
  return cy.get('[data-cy=about-text]').invoke('text')
}

export function getAllFormLabels() {
  return cy.get(`[data-cy="kummerform-labels"]`);
}

export function getLabels() {
  return cy.get('[data-cy^=label-]')
}

export function getLabelsMessage() {
  return cy.get("[data-cy=kummerform-labels-message]");
}

export function getFormLabelCheckbox(id: string) {
  return cy.get(`[data-cy="kummerform-label-checkbox-${id}"]`);
}

export function getTitleInput() {
  return cy.get("[data-cy=kummerform-title-input]");
}

export function getTitleInputLength() {
  return getTitleInput().invoke("val");
}

export function getTitleMessage() {
  return cy.get("[data-cy=kummerform-title-message]");
}

export function getTextInput() {
  return cy.get('[data-cy="kummerform-text-input"]');
}

export function getTextInputLength() {
  return getTextInput().invoke("val");
}

export function getTextMessage() {
  return cy.get("[data-cy=kummerform-text-message]");
}

export function getSendButton() {
  return cy.get(`[data-cy="kummerform-send"]`);
}

export function getQAPs(id: string) {
  return cy.get(`[data-cy="kummerform-faq-${id}"]`);
}

export function getQAPQuestion(id: string) {
  return cy.get(`[data-cy="kummerform-faq-question${id}"]`);
}

export function getQAPAnswer(id: string) {
  return cy.get(`[data-cy="kummerform-faq-answer${id}"]`);
}

export function QAPEmpty() {
  return cy.get(`[data-cy=kummerform-faq-empty]`);
}

export function getThemeToggle() {
  return cy.get("[data-cy=theme-toggle]");
}

export function fillOutForm(data: KummerFormData) {
  if (data.formLabelArray) {
    if (data.formLabelVal) {
      for (let i = 0; i < data.formLabelArray.length; i++) {
        if (data.formLabelVal[i]) {
          getFormLabelCheckbox(data.formLabelArray[i].id).click();
        }
      }
    }
  }
  if (data.title) {
    getTitleInput().type(data.title);
  }
  if (data.text) {
    getTextInput().type(data.text);
  }
}

export function submit() {
  getSendButton().click();
}

