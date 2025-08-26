import users from "../fixtures/users.json";
import * as ticketPage from "../pages/ticket-overview.po";
import * as statusBar from "../pages/ticket-detail.po";

describe('Ticket Overview Page', () => {
    const currentCorrectMail = users.cypress.mail;
    const currentCorrectPassword = users.cypress.password;

    let tickets: any[] = [];
    let labels: any[] = [];

    beforeEach(() => {
        cy.login(currentCorrectMail, currentCorrectPassword);

        cy.getAllLabels().then(fetchedLabels => {
            labels = fetchedLabels;
        });

        cy.getAllTickets().then(fetchedTickets => {
            tickets = fetchedTickets;
        });

        cy.visit("/tickets");
    });

    context('page elements', () => {
        it('should load the ticket overview page', () => {
            cy.url().should('include', '/tickets');
            if (tickets.length > 0) {
                ticketPage.getTicketCard(tickets[0].id).should('exist');
            }
        });

        it('should display search inputs', () => {
            ticketPage.getSearchTitleInput().should('exist');
            ticketPage.getSearchTextInput().should('exist');
        });

        it('should display state and label filter buttons', () => {
            ticketPage.getStateFilterButton().should('exist');
            ticketPage.getLabelFilterButton().should('exist');
        });

        it('should display sort options', () => {
            ticketPage.getSortButton().should('exist');
        });
    });

    context('Searching', () => {
        it('should filter tickets by title', () => {
            const title = tickets[0]?.title;
            if (title) {
                ticketPage.getSearchTitleInput().type(title);
                ticketPage.getTicketCard(tickets[0].id).should('exist');
            }
        });

        it('should filter tickets by text', () => {
            const text = tickets[0]?.text;
            if (text) {
                ticketPage.getSearchTextInput().type(text);
                ticketPage.getTicketCard(tickets[0].id).should('exist');
            }
        });
    });

    context('Filtering', () => {
        it('should filter tickets by status', () => {
            const state = tickets[0]?.state;
            if (state) {
                ticketPage.getStateFilterButton().click();
                cy.contains(state).click();
                ticketPage.getTicketCard(tickets[0].id).should('exist');
            }
        });

        it('should filter tickets by label', () => {
            const label = tickets[0]?.labels?.[0]?.name;
            if (label) {
                ticketPage.getLabelFilterButton().click();
                cy.contains(label)
                    .should('be.visible')
                    .click();
                ticketPage.getTicketCard(tickets[0].id).should('exist');
            }
        });
    });

    context('Sorting', () => {
        it('should sort tickets by create date ascending', () => {
            ticketPage.getSortButton().click();
            ticketPage.getSortOrderAsc().click();
            if (tickets.length >= 1) {
                ticketPage.getTicketCard(tickets[0].id).should('exist');
            }
        });

        it('should sort tickets by create date descending', () => {
            ticketPage.getSortButton().click();
            ticketPage.getSortOrderDesc().click();
            if (tickets.length >= 1) {
                ticketPage.getTicketCard(tickets[0].id).should('exist');
            }
        });
    });

    context('wrong search', () => {
        it('should display no tickets if search matches nothing', () => {
            ticketPage.getSearchTitleInput().type("nonexistenttickettitle");
            cy.get("[data-cy^='ticket-card-']").should('have.length', 0);
        });
    });
});
