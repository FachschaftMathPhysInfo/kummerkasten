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
            ticketPage.getDesktopSearchTextInput().should('not.be.disabled')
          })
          it('show all tickets (with states new and open) if no text entered', () => {
            ticketPage.getDesktopSearchTextInput().clear()
            tickets.forEach((ticket: any) => {
              ticketPage.getTicketCard(ticket.id).should('exist').and('be.visible');
            });
            cy.get('[data-cy^="ticket-card-"]').should('have.length', tickets.length);
          })
          //TODO FIX
          it('show all tickets with searchterm in title or text', () => {
            const ticket = tickets[0]
            ticketPage.getDesktopSearchTextInput().clear().type(ticket.text);
            ticketPage.getTicketCard(ticket.id).should('exist');
            cy.get('[data-cy^="ticket-card-"]').should('have.length', 1);
          })
          it('show no tickets for non-existent searchterm', () => {
            ticketPage.getDesktopSearchTextInput().clear().type('NO_SUCH_TICKET');
            cy.get('[data-cy^="ticket-card-"]').should('have.length', 0);
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
            ticketPage.getDesktopOverviewStateFilterButton().should('not.be.disabled');
          })

          it('status field should have 3 status buttons', () => {
            ticketPage.getDesktopOverviewStateFilterButton().click()
            ticketPage.getDesktopOverviewStatusButtonNew().should('be.visible');
            ticketPage.getDesktopOverviewStatusButtonOpen().should('be.visible');
            ticketPage.getDesktopOverviewStatusButtonClosed().should('be.visible');
          })

          it('status field should have a search bar', () => {
            ticketPage.getDesktopOverviewStateFilterButton().click()
            ticketPage.getDesktopOverviewStatusFilterSearch().should('be.visible').should('not.be.disabled')
          })

          it('status field should be filterable', () => {
            ticketPage.getDesktopOverviewStateFilterButton().click()
            ticketPage.getDesktopOverviewStatusFilterSearch().type('Offen')
            ticketPage.getDesktopOverviewStatusButtonClosed().should('not.be.visible')
            ticketPage.getDesktopOverviewStatusButtonNew().should('not.be.visible')
            ticketPage.getDesktopOverviewStatusButtonOpen().should('be.visible')
          })

          it('status field should show selected status amount in button', () => {
            ticketPage.getDesktopOverviewStateFilterButton().contains('2');
          })

          it('status field should reset to new and open', () => {
            ticketPage.getDesktopOverviewStateFilterButton().click();
            ticketPage.getDesktopOverviewStatusButtonClosed().click();
            ticketPage.getDesktopOverviewStateFilterButton().click();
            ticketPage.getDesktopOverviewResetFilters().click()
            ticketPage.getDesktopOverviewStateFilterButton().contains('2');
          })

          it('filtering by open shows only open tickets', () => {
            ticketPage.getDesktopOverviewStateFilterButton().click();
            ticketPage.getDesktopOverviewStatusButtonNew().click();
          })

          it('filtering by closed shows only closed tickets', () => {
            ticketPage.getDesktopOverviewStateFilterButton().click();
            ticketPage.getDesktopOverviewStatusButtonNew().click();
            ticketPage.getDesktopOverviewStatusButtonClosed().click();
          })

          it('filtering by new shows only new tickets', () => {
            ticketPage.getDesktopOverviewStateFilterButton().click();
            ticketPage.getDesktopOverviewStatusButtonNew().click();
            ticketPage.getDesktopOverviewStatusButtonClosed().click();
          })
        })

        context('Labels Field', () => {
          it('labels field should be interactable', () => {

          })
          it('labels field should be loaded with no labels selected', () => {

          })
          it('labels field should have all labels loaded as options', () => {

          })
          it('labels field should have a search function', () => {

          })
          it('labels field should be filterable', () => {

          })
          it('labels field should show selected amount in button', () => {

          })
          it('labels field should have a reset button', () => {

          })
          it('labels field should reset to no labels selected', () => {

          })
          it('filtering by label should only show tickets with that label', () => {

          })
          it('filtering with several labels should only show tickets with all those labels', () => {

          })
          it('show no ticket if no ticket exists with that selection of labels', () => {

          })
        })
        context('Start Calendar', () => {
          it('start calendar should have no date selected as default', () => {

          })
          it('start calendar should show selected date in button', () => {

          })
          it('start calendar should be interactable', () => {

          })
          it('start calendar should have a reset button', () => {

          })
          it('start calendar should reset to no date selected', () => {

          })
          it('show tickets created after start date if start date selected', () => {

          })
          it('show all tickets (new and open ticketstate) if no start date selected', () => {

          })
        })
        context('End Calendar', () => {
          it('end calendar should have no date selected as default', () => {

          })
          it('end calendar should show selected date in button', () => {

          })
          it('end calendar should be interactable', () => {

          })
          it('end calendar should have a reset button', () => {

          })
          it('end calendar should reset to no date selected', () => {

          })
          it('show tickets created before end date if end date selected', () => {

          })
          it('show all tickets (new and open ticketstate) if no end date selected', () => {

          })
        })
        context('Sorting', () => {
          it('sorting button should be interactable', () => {

          })
          it('sorting button should have 3 sorting values', () => {

          })
          it('selecting a sorting order should show tickets in that order', () => {

          })
          it('clicking on the same button again should reverse the order', () => {

          })
          it('show sorting type and order in button', () => {

          })
          it('sort tickets by create date ascending', () => {

          });

          it('sort tickets by create date descending', () => {

          });

          it('sort tickets by modified date ascending', () => {

          })
          it('sort tickets by modified date descending', () => {

          })
          it('sort tickets by title ascending', () => {

          })
          it('sort tickets by title descending', () => {

          })
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


    context('wrong search', () => {

    });
  })
})
;
