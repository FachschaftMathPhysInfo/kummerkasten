import users from "../fixtures/users.json";
import * as ticketDetail from "../pages/ticket-detail.po";

describe('Ticket Detail / Status Bar', () => {
    const currentCorrectMail = users.cypress.mail;
    const currentCorrectPassword = users.cypress.password;

    let tickets: any[] = [];

    beforeEach(() => {
        cy.login(currentCorrectMail, currentCorrectPassword);

        cy.getAllTickets().then(fetchedTickets => {
            tickets = fetchedTickets;
        });

        if (tickets.length > 0) {
            cy.visit(`/tickets/${tickets[0].id}`);
        }
    });

    context('basics', () => {
        it('copy button should exist', () => {
            cy.visit(`/tickets/${tickets[0].id}`);
            ticketDetail.getCopyLinkButton()
                .should('exist')
                .should('be.visible')
        });

        it('edit button should exist', () => {
            ticketDetail.getEditTicketButton()
                .should('exist')
                .should('be.visible')
        });

        it('delete button should exist', () => {
            ticketDetail.getDeleteTicketButton()
                .should('exist')
                .should('be.visible')
        });

        it('back button should exist', () => {
            ticketDetail.getExitTicketButton()
                .should('exist')
                .should('be.visible')
        });

        it('should display ticket state badge', () => {
            ticketDetail.getTicketStatusBadgeDetail()
                .should('exist')
                .should('be.visible')
        });

        it('should display all ticket labels', () => {
            cy.get('[data-cy^="ticket-label-"]')
                .should('exist')
                .should('be.visible');
        });
    });
});
