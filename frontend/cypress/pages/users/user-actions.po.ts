import * as dialog from "../confirmation-dialog.po"
import * as page from "./user-management.po"
import {getClient} from "../../../lib/graph/client";
import {DeleteUsersDocument, GetUserIdByMailDocument} from "../../../lib/graph/generated/graphql";

export function getDeleteButton() {
  return cy.get('[data-cy="delete-button"]');
}

export function getDemoteButton() {
  return cy.get('[data-cy="demote-button"]');
}

export function getPromoteButton() {
  return cy.get('[data-cy="promote-button"]');
}

export function getResetPasswordButton() {
  return cy.get('[data-cy="reset-password-button"]');
}

export function deleteUser(mail: string) {
  page.getActionsOfUsers(mail).click()
  getDeleteButton().click();
  dialog.confirm()
}

export function promoteUser(mail: string) {
  page.getActionsOfUsers(mail).click()
  getPromoteButton().click();
  dialog.confirm()
}

export function demoteUser(mail: string) {
  page.getActionsOfUsers(mail).click()
  getDemoteButton().click();
  dialog.confirm()
}

export async function deleteUserAPI(mail: string) {
  const client = getClient();
  const data = await client.request(GetUserIdByMailDocument, {mail: [mail]})
  const id = data.users?.find(u => !!u)?.id
  if (id) await client.request(DeleteUsersDocument, {ids: [id]})
}

