import { getClient } from "../../lib/graph/client";
import {
  AllTicketsDocument,
  DeleteTicketDocument,
} from "../../lib/graph/generated/graphql";

export type KummerFormData = {
  formLabelArray?: any[];
  formLabelVal?: boolean[];
  title?: string;
  text?: string;
};
export function getAboutText() {
  return cy.get(`[data-cy=kummerform-about]`);
}
export function getAllFormLabels() {
  return cy.get(`[data-cy="kummerform-labels"]`);
}
export function getLabelsMessage() {
  return cy.get("[data-cy=kummerform-labels-message]");
}
export function getFormLabel(id: string) {
  return cy.get(`[data-cy="kummerform-label-${id}"]`);
}
export function getFormLabelCheckbox(id: string) {
  return cy.get(`[data-cy="kummerform-label-checkbox-${id}"]`);
}
export function getFormLabelName(id: string) {
  return cy.get(`[data-cy="kummerform-label-name-${id}"]`);
}
export function getTitleInput() {
  return cy.get("[data-cy=kummerform-title-input]");
}
export function getTitleInputLength() {
  return cy.get("[data-cy=kummerform-title-input]").invoke("val");
}
export function getTitleMessage() {
  return cy.get("[data-cy=kummerform-title-message]");
}
export function getTextInput() {
  return cy.get('[data-cy="kummerform-text-input"]');
}
export function getTextInputLength() {
  return cy.get('[data-cy="kummerform-text-input"]').invoke("val");
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
export function fillOutForm(data: KummerFormData) {
  if (data.formLabelArray) {
    if (data.formLabelVal) {
      //i'd be so surprised if this works edit: it worked, i'm suprised but hyped, keeping this in here until merge -> TODO: remove this comment
      for (let i = 0; i < data.formLabelArray.length; i++) {
        if (data.formLabelVal[i]) {
          cy.log("Checking label " + i);
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
//will propably be obsolete after #288
export function checkTicketExistence(title: string) {
  return cy.get(`[data-cy="kummerform-titlecheck-${title}"]`);
}

export async function deleteTicketsAPI(title: string) {
  const client = getClient();
  const data = await client.request(AllTicketsDocument);

  const ticketsToDelete = data.tickets?.filter(
    (t) => !!t && title.includes(t.originalTitle)
  );
  if (ticketsToDelete && ticketsToDelete.length > 0) {
    const idsToDelete = ticketsToDelete.filter((t) => t?.id).map((t) => t!.id);
    await client.request(DeleteTicketDocument, { ids: idsToDelete });
    console.log(
      `Deleted ${idsToDelete.length} tickets with originalTitle "${title}".`
    );
  }
}

export function submit() {
  getSendButton().click();
}
