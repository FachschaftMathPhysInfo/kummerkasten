/// <reference types="cypress" />

// Add this to cypress/support/commands.js
import * as sidebar from "../pages/sidebar.po"
import {UpdateUser} from "@/lib/graph/generated/graphql";

Cypress.Commands.add('login', (mail: string, password: string) => {
  cy.session([mail, password], () => {
    const query = `query login($mail: String!, $password: String!) {login(mail: $mail, password: $password)}`;

    return cy.request({
      method: 'POST',
      url: 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        query,
        variables: {
          mail: mail,
          password: password
        },
        operationName: 'login'
      }
    });
  })
});

Cypress.Commands.add('logout', () => {
  sidebar.getLogout().click();
  cy.clearAllCookies();
  cy.visit('/login');
});

// cypress/support/commands.js
Cypress.Commands.add("getUserIdByMail", (mail: string) => {
  const query = `
    query getUserIdByMail($mail: [String!]!) {
      users( mail: $mail ) {
        id
      }
    }
  `;

  return cy
    .request({
      method: "POST",
      url: "/api",
      body: {query, variables: {mail: [mail]}, operationName: "getUserIdByMail"},
    })
    .its("body.data.users[0].id") as Cypress.Chainable<string>;
});


Cypress.Commands.add("updateUserProfile", (id: string, user: UpdateUser) => {
  const mutation = `
        mutation updateUser($id: String!, $user: UpdateUser!) {
            updateUser(id: $id, user: $user)
        }
    `;

  return cy.request({
    method: "POST",
    url: "http://localhost:8080/api",
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      query: mutation,
      variables: {
        id: id,
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          mail: user.mail,
        }
      },
      operationName: "updateUser"
    }
  });
});

Cypress.Commands.add(
  "updateUserPassword",
  (id: string, newPassword: string): Cypress.Chainable<Cypress.Response<any>> => {
    const mutation = `
      mutation updateUser($id: String!, $user: UpdateUser!) {
        updateUser(id: $id, user: $user)
      }
    `;

    return cy.request({
      method: "POST",
      url: "http://localhost:8080/api",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        query: mutation,
        variables: {
          id,
          user: {
            password: newPassword,
          },
        },
        operationName: "updateUser",
      },
    });
  }
);

Cypress.Commands.add("getAllTickets", (): Cypress.Chainable<any> => {
  const query = `
        query allTickets {
            tickets {
                id
                originalTitle
                title
                text
                note
                state
                createdAt
                lastModified
                labels {
                    id
                    name
                    color
                }
            }
        }
    `;

  return cy.request({
    method: "POST",
    url: "/api",
    headers: {"Content-Type": "application/json"},
    body: {query, operationName: "allTickets"},
  }).its("body.data.tickets");
});

Cypress.Commands.add("getAllLabels", (): Cypress.Chainable<any> => {
  const query = `
        query allLabels {
            labels {
                id
                name
                color
            }
        }
    `;

  return cy.request({
    method: "POST",
    url: "/api",
    headers: {"Content-Type": "application/json"},
    body: {query, operationName: "allLabels"},
  }).its("body.data.labels");
});

Cypress.Commands.add("getFooterSettings", (): Cypress.Chainable<Record<string, string>> => {
  const query = `
        query footerSettings {
            footerSettings {
                key
                value
            }
        }
    `;

  return cy.request({
    method: "POST",
    url: "/api",
    headers: {"Content-Type": "application/json"},
    body: {query, operationName: "footerSettings"},
  }).then((res) => {
    const data = res.body.data.footerSettings;
    const settings: Record<string, string> = {};
    data.forEach((s: any) => {
      settings[s.key] = s.value;
    });
    return settings;
  });
});


declare global {
  namespace Cypress {
    interface Chainable {
      login(mail: string, password: string): Chainable<Response<any>>;

      logout(): Chainable<Response<any>>

      getUserIdByMail(mail: string): Chainable<string>;

      updateUserProfile(id: string, user: UpdateUser): Chainable<Response<any>>;

      updateUserPassword(currentPassword: string, newPassword: string): Chainable<Response<any>>;

      getAllTickets(): Chainable<any>;

      getAllLabels(): Chainable<any>;

      getFooterSettings(): Chainable<any>;
    }
  }
}

export {}