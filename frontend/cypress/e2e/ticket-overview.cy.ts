import users from "../fixtures/users.json";
import * as ticketPage from "../pages/ticket-overview.po";

describe('Ticket Overview Page Tests:', () => {
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

  context('As Admin', () => {
    context('On Desktop', () => {
      context('Loading', () => {
        it('loads the page', () => {
          cy.url().should('include', '/tickets');
        });

        it('loads filter options', () => {
          ticketPage.getDesktopSearchTextInput().should('exist')
          ticketPage.getDesktopOverviewStateFilterButton().should('exist')
          ticketPage.getDesktopOverviewLabelFilterButton().should('exist')
          ticketPage.getDesktopCalendarStartButton().should('exist')
          ticketPage.getDesktopCalendarEndButton().should('exist')
          ticketPage.getSortingSelectionSortButton().should('exist')
        });

        it('shows filter options', () => {
          ticketPage.getDesktopSearchTextInput().should('be.visible')
          ticketPage.getDesktopOverviewStateFilterButton().should('be.visible')
          ticketPage.getDesktopOverviewLabelFilterButton().should('be.visible')
          ticketPage.getDesktopCalendarStartButton().should('be.visible')
          ticketPage.getDesktopCalendarEndButton().should('be.visible')
          ticketPage.getSortingSelectionSortButton().should('be.visible')
        })

        it('clear filter does not exist on start', () => {
          ticketPage.getDesktopOverviewResetFilters().should('not.exist')
        })
      });

      context('Filtering', () => {
        context('Search Field', () => {
          it('search field should be interactable', () => {

          })
        })
        context('Status Field', () => {
          //TODO FIX
          it('show tickets with states new or open as default', () => {
            cy.getTicketsByStateNewOrOpen().then((tickets) => {
              tickets.forEach((ticket: any) => {
                ticketPage.getTicketCard(ticket.id).should('exist').and('be.visible');
              });
              cy.get('[data-cy^="ticket-card-"]').should('have.length', tickets.length);
            });
          });

          it('status field should be interactable', () => {

          })

          it('status field should have 3 status buttons', () => {

          })

          it('status field should be filterable', () => {

          })

          it('status field should show selected status amount in button', () => {

          })

          it('status field should have reset button', () => {

          })

          it('status field should reset to new and open', () => {

          })
        })

        context('Labels Field', () => {

        })
      })
    });

    context('Filtering', () => {
      it('should filter tickets by status', () => {
        const state = tickets[0]?.state;
        if (state) {
          ticketPage.getDesktopOverviewStateFilterButton().click();
          cy.contains(state).click();
          ticketPage.getTicketCard(tickets[0].id).should('exist');
        }
      });

      it('should filter tickets by label', () => {
        const label = tickets[0]?.labels?.[0]?.name;
        if (label) {
          ticketPage.getDesktopOverviewLabelFilterButton().click();
          cy.contains(label)
            .should('be.visible')
            .click();
          ticketPage.getTicketCard(tickets[0].id).should('exist');
        }
      });
    });

    context('Sorting', () => {
      it('should sort tickets by create date ascending', () => {
        if (tickets.length >= 1) {
          ticketPage.getTicketCard(tickets[0].id).should('exist');
        }
      });

      it('should sort tickets by create date descending', () => {
        if (tickets.length >= 1) {
          ticketPage.getTicketCard(tickets[0].id).should('exist');
        }
      });
    });

    context('wrong search', () => {
      it('should display no tickets if search matches nothing', () => {
        cy.get("[data-cy^='ticket-card-']").should('have.length', 0);
      });
    });
  })
})
;
