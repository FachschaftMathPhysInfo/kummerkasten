/// <reference types="cypress" />

// Add this to cypress/support/commands.js

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

declare global {
  namespace Cypress {
    interface Chainable {
      login(mail: string, password: string): Chainable<Response<any>>;
    }
  }
}

export {}