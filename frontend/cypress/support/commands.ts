/// <reference types="cypress" />

// Add this to cypress/support/commands.js
import * as sidebar from "../pages/sidebar.po";
import {NewLabel, NewTicket, TicketState, UpdateUser, UserRole} from "../../lib/graph/generated/graphql";
import * as users from "../fixtures/users.json";
import {LabelDialogData} from "@/cypress/pages/labels/label-management.po";

Cypress.Commands.add("login", (mail: string, password: string) => {
  cy.session([mail, password], () => {
    const query = `query login($mail: String!, $password: String!) {login(mail: $mail, password: $password)}`;

    return cy.request({
      method: "POST",
      url: "http://localhost:8080/api",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        query,
        variables: {
          mail: mail,
          password: password,
        },
        operationName: "login",
      },
    });
  });
});

Cypress.Commands.add("loginAsRole", (role: UserRole) => {
  if (role === UserRole.Admin)
    cy.login(users.cypress.mail, users.cypress.password);
  else cy.login(users.fsles1.mail, users.fsles1.password);
});

Cypress.Commands.add("logout", () => {
  sidebar.getLogout().click();
  cy.clearAllCookies();
  cy.visit("/login");
});

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
      body: {
        query,
        variables: {mail: [mail]},
        operationName: "getUserIdByMail",
      },
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
      "Content-Type": "application/json",
    },
    body: {
      query: mutation,
      variables: {
        id: id,
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          mail: user.mail,
        },
      },
      operationName: "updateUser",
    },
  });
});

Cypress.Commands.add(
  "updateUserPassword",
  (id: string, newPassword: string) => {
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

Cypress.Commands.add("deleteUser", (mail: string) => {
  cy.getUserIdByMail(mail).then((id) => {
    cy.loginAsRole(UserRole.Admin);

    const mutation = `
      mutation deleteUser($id: String!) {
        deleteUser(ids: [$id])
      }
    `;

    cy.request({
      method: "POST",
      url: "http://localhost:8080/api",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        query: mutation,
        variables: {
          id: id,
        },
        operationName: "deleteUser",
      },
    });
  });
});

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

  return cy
    .request({
      method: "POST",
      url: "/api",
      headers: {"Content-Type": "application/json"},
      body: {query, operationName: "allTickets"},
    })
    .its("body.data.tickets");
});

Cypress.Commands.add(
  "getTicketsByStateNewOrOpen",
  (): Cypress.Chainable<any[]> => {
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

    return cy
      .request({
        method: "POST",
        url: "/api",
        headers: {"Content-Type": "application/json"},
        body: {query, operationName: "allTickets"},
      })
      .then((response) => {
        const tickets = response.body.data.tickets;
        return tickets.filter(
          (t: any) =>
            t.state === TicketState.New || t.state === TicketState.Open
        );
      });
  }
);

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

  return cy
    .request({
      method: "POST",
      url: "/api",
      headers: {"Content-Type": "application/json"},
      body: {query, operationName: "allLabels"},
    })
    .its("body.data.labels");
});

Cypress.Commands.add("createLabel", (data: LabelDialogData) => {
  const newLabel: NewLabel = {
    name: data.name,
    color: data.color,
    formLabel: data.public,
  };

  const mutation = `
    mutation createLabel($label: NewLabel!) {
      createLabel(label: $label) {
        id
      }
    }
  `;

  cy.request({
    method: "POST",
    url: "/api",
    headers: {"Content-Type": "application/json"},
    body: {
      query: mutation,
      operationName: "createLabel",
      variables: {label: newLabel},
    },
  });
});

Cypress.Commands.add("deleteLabels", (names: string[]) => {
  cy.loginAsRole(UserRole.Admin);
  return cy
    .getAllLabels()
    .then((labels: Array<{ id: string; name: string }>) => {
      const idsToDelete = labels
        .filter((label) => names.includes(label.name))
        .map((l) => l.id);

      if (!idsToDelete.length) {
        return;
      }

      const mutation = `
      mutation deleteLabel($ids: [String!]!) {
        deleteLabel(ids: $ids)
      }
    `;

      cy.request({
        method: "POST",
        url: "/api",
        headers: {"Content-Type": "application/json"},
        body: {
          query: mutation,
          operationName: "deleteLabel",
          variables: {ids: idsToDelete},
        },
      });
    });
});

Cypress.Commands.add("getAboutText", () => {
  const query = "query aboutText {aboutSectionSettings { value }}";

  return cy
    .request({
      method: "POST",
      url: "/api",
      headers: {"Content-Type": "application/json"},
      body: {query, operationName: "aboutText"},
    })
    .then((res) => {
      return res.body.data.aboutSectionSettings[0].value;
    });
});

Cypress.Commands.add("updateAboutText", (text: string) => {
  const mutation =
    "mutation updateAboutText($text: String!) {updateAboutSectionText(text: $text)}";

  cy.request({
    method: "POST",
    url: "/api",
    headers: {"Content-Type": "application/json"},
    body: {
      query: mutation,
      operationName: "updateAboutText",
      variables: {text: text},
    },
  });
});

Cypress.Commands.add(
  "getFooterSettings",
  (): Cypress.Chainable<Record<string, string>> => {
    const query = `
        query footerSettings {
            footerSettings {
                key
                value
            }
        }
    `;

    return cy
      .request({
        method: "POST",
        url: "/api",
        headers: {"Content-Type": "application/json"},
        body: {query, operationName: "footerSettings"},
      })
      .then((res) => {
        const data = res.body.data.footerSettings;
        const settings: Record<string, string> = {};
        data.forEach((s: any) => {
          settings[s.key] = s.value;
        });
        return settings;
      });
  }
);
Cypress.Commands.add("getFormLabels", (): Cypress.Chainable<any> => {
  const query = `
        query formLabels {
            formLabels {
            id
            name
            formLabel
            }
        }
    `;

  return cy
    .request({
      method: "POST",
      url: "/api",
      headers: {"Content-Type": "application/json"},
      body: {query, operationName: "formLabels"},
    })
    .its("body.data.formLabels");
});

Cypress.Commands.add("getAllQAPs", (): Cypress.Chainable<any> => {
  const query = `
        query allQuestionAnswerPair{
            questionAnswerPairs{
                question
                answer
                id
                position
            }
        }
    `;

  return cy
    .request({
      method: "POST",
      url: "/api",
      headers: {"Content-Type": "application/json"},
      body: {query, operationName: "allQuestionAnswerPair"},
    })
    .its("body.data.questionAnswerPairs");
});

Cypress.Commands.add(
  "deleteFormTickets",
  (title: string): Cypress.Chainable<Cypress.Response<any>> => {
    const mutation = `
      mutation deleteTicket($ids: [String!]!) {
        deleteTicket(ids: $ids)
      }
    `;

    cy.login(users.cypress.mail, users.cypress.password);

    return cy.getAllTickets().then((tickets: any[]) => {
      const ticketsToDelete = tickets.filter((t) => t.originalTitle === title);

      if (ticketsToDelete.length === 0) {
        return cy.wrap({
          status: 200,
          statusText: "OK",
          body: {data: {deleteTicket: 0}},
          headers: {},
          duration: 0,
        } as Cypress.Response<any>);
      }

      const idsToDelete = ticketsToDelete.map((t) => t.id);

      return cy.request({
        method: "POST",
        url: "http://localhost:8080/api",
        headers: {"Content-Type": "application/json"},
        body: {
          query: mutation,
          variables: {ids: idsToDelete},
          operationName: "deleteTicket",
        },
      });
    });
  }
);

Cypress.Commands.add('createTicket', (ticket: NewTicket): Cypress.Chainable<string> => {
  const newTicket: NewTicket = {
    originalTitle: ticket.originalTitle,
    text: ticket.text,
    labels: ticket.labels,
  };

  const mutation = `
    mutation createTicket($ticket: NewTicket!) {
      createTicket(ticket: $ticket) {
        id
      }
    }
  `;

  return cy.request({
    method: "POST",
    url: "/api",
    headers: {"Content-Type": "application/json"},
    body: {
      query: mutation,
      operationName: "createTicket",
      variables: {ticket: newTicket},
    },
  }).then((res) => res.body.data.createTicket.id as string);
});

Cypress.Commands.add('deleteTicket', (id: string): Cypress.Chainable<Cypress.Response<any>> => {
  cy.loginAsRole(UserRole.Admin)
  const mutation = `
    mutation deleteTicket($ids: [String!]!) {
      deleteTicket(ids: $ids)
    }
  `;

  return cy.request({
    method: "POST",
    url: "/api",
    headers: {"Content-Type": "application/json"},
    body: {
      query: mutation,
      variables: {ids: [id]},
      operationName: "deleteTicket",
    },
  });
});


declare global {
  namespace Cypress {
    interface Chainable {
      login(mail: string, password: string): Chainable<Response<any>>;

      loginAsRole(role: UserRole): Chainable<any>;

      logout(): Chainable<Response<any>>;

      getUserIdByMail(mail: string): Chainable<string>;

      updateUserProfile(id: string, user: UpdateUser): Chainable<Response<any>>;

      updateUserPassword(
        currentPassword: string,
        newPassword: string
      ): Chainable<Response<any>>;

      deleteUser(mail: string): Chainable<any>;

      getAllTickets(): Chainable<any>;

      getAllLabels(): Chainable<any>;

      getTicketsByStateNewOrOpen(): Chainable<any>;

      getFooterSettings(): Chainable<any>;

      deleteLabels(name: string[]): Chainable<any>;

      createLabel(label: LabelDialogData): Chainable<any>;

      getFormLabels(): Chainable<any>;

      getAllQAPs(): Chainable<any>;

      deleteFormTickets(title: string): Chainable<Response<any>>;

      getAboutText(): Chainable<string>;

      updateAboutText(text: string): Chainable<any>;

      getFooterSettings(): Chainable<any>;

      createTicket(ticket: NewTicket): Chainable<string>;

      deleteTicket(id: string): Chainable<Cypress.Response<any>>;
    }
  }
}

export {}