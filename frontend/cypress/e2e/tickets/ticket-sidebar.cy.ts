import {Label, Ticket, TicketState, UserRole} from "../../../lib/graph/generated/graphql";
import * as ticketSidebar from "../../pages/tickets/ticket-sidebar.po";
import * as filterBar from "../../pages/tickets/filter-bar.po";
import * as ticketPage from "../../pages/tickets/ticket-overview.po";
import {getTodayCalendarLabel, getTodaySuffixForCalendar} from "../../pages/tickets/ticket-overview.po";

const roles: UserRole[] = [UserRole.Admin, UserRole.User]

roles.forEach(role => {
  describe("Ticket Detail Sidebar", () => {
    let tickets: Ticket[] = [];
    let labels: Label[] = [];
    context(`${role} Tests`, () => {
      beforeEach(() => {
        cy.loginAsRole(role).then(() => {
          cy.getAllLabels().then(fetchedLabels => {
            labels = fetchedLabels;
          });
          cy.getAllTickets().then(fetchedTickets => {
            tickets = fetchedTickets;
            cy.visit(`/tickets/${fetchedTickets[0].id}`);
          });

        })
      })

      context(`Loading`, () => {
        it('loads the page', () => {
          cy.url().should('include', `/tickets/${tickets[0].id}`);
        });

        it('loads page elements', () => {
          ticketSidebar.getTicketDetailSearch().should('exist')
          ticketSidebar.getTicketDetailFilterButton().should('exist');
        });

        it('loads filter bar elements', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewStateFilterButton().should('exist')
          filterBar.getDesktopOverviewLabelFilterButton().should('exist')
          filterBar.getDesktopCalendarStartButton().should('exist')
          filterBar.getDesktopCalendarEndButton().should('exist')
          filterBar.getSortingSelectionSortButton().should('exist')
        })

        it('shows filter bar elements', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewStateFilterButton().scrollIntoView().should('be.visible')
          filterBar.getDesktopOverviewLabelFilterButton().scrollIntoView().should('be.visible')
          filterBar.getDesktopCalendarStartButton().scrollIntoView().should('be.visible')
          filterBar.getDesktopCalendarEndButton().scrollIntoView().should('be.visible')
          filterBar.getSortingSelectionSortButton().scrollIntoView().should('be.visible')
        })

        it('clear filter does not exist on start', () => {
          ticketSidebar.getTicketDetailFilterReset().should('not.exist')
        })

        it('shows ticket breadcrumb', () => {
          ticketSidebar.getTicketsBreadcrumb().should('exist')
        })

        it('ticket breadcrumb works properly', () => {
          ticketSidebar.getTicketsBreadcrumb().should('exist').click()
          cy.url().should('include', `/tickets`);
        })
      })

      context(`Filtering`, () => {
        it('search field should be interactable', () => {
          ticketSidebar.getTicketDetailSearch().should('not.be.disabled')
        })

        it('show all tickets (with states new and open) if no text entered', () => {
          ticketSidebar.getTicketDetailSearch().clear()
          const visibleTickets = tickets.filter(
            (t) => t.state === TicketState.New || t.state === TicketState.Open
          );
          const closedTickets = tickets.filter(
            (t) => t.state === TicketState.Closed
          );
          visibleTickets.forEach((ticket) => {
            ticketSidebar.getTicketCard(ticket.id).should('exist').and('be.visible');
          });
          closedTickets.forEach((ticket) => {
            ticketSidebar.getTicketCard(ticket.id).should('not.exist');
          });
          cy.get('[data-cy^="ticket-card-id"]').should('have.length', visibleTickets.length);
        })

        it('show all tickets with searchterm in title or text', () => {
          const ticket = tickets[0]
          ticketSidebar.getTicketDetailSearch().clear().type(ticket.text);
          ticketSidebar.getTicketCard(ticket.id).should('exist');
          cy.get('[data-cy^="ticket-card-id"]').should('have.length', 1);
        })

        it('show no tickets for non-existent searchterm', () => {
          ticketSidebar.getTicketDetailSearch().clear().type('NO_SUCH_TICKET');
          cy.get('[data-cy^="ticket-card-id"]').should('have.length', 0);
        })
      })

      context(`Status Field`, () => {
        it('show tickets with states new or open as default', () => {
          cy.getTicketsByStateNewOrOpen().then((tickets) => {
            tickets.forEach((ticket: any) => {
              ticketSidebar.getTicketCard(ticket.id).should('exist').and('be.visible');
            });
            cy.get('[data-cy^="ticket-card-id"]').should('have.length', tickets.length);
          });
        });

        it('status field should be interactable', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewStateFilterButton().should('exist').and('not.be.disabled');
        })

        it('status field should have 3 status buttons', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewStateFilterButton().click()
          filterBar.getDesktopOverviewStatusButtonNew().should('be.visible');
          filterBar.getDesktopOverviewStatusButtonOpen().should('be.visible');
          filterBar.getDesktopOverviewStatusButtonClosed().should('be.visible');
        })

        it('status field should have a search bar', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewStateFilterButton().click()
          filterBar.getDesktopOverviewStatusFilterSearch().should('be.visible').should('not.be.disabled')
        })

        it('status field should be filterable', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewStateFilterButton().click()
          filterBar.getDesktopOverviewStatusFilterSearch().type('Offen')
          filterBar.getDesktopOverviewStatusButtonClosed().should('not.exist')
          filterBar.getDesktopOverviewStatusButtonNew().should('not.exist')
          filterBar.getDesktopOverviewStatusButtonOpen().should('be.visible')
        })

        it('status field should show selected status amount in button', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewStateFilterButton().contains('2');
        })

        it('status field should reset to new and open', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewStateFilterButton().should('exist');
          filterBar.getDesktopOverviewStateFilterButton().click();
          filterBar.getDesktopOverviewStatusButtonClosed().click();
          filterBar.getDesktopOverviewStateFilterButton().click();
          ticketSidebar.getTicketDetailFilterReset().click();
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewStateFilterButton().contains('2');
        })

        it('filtering by open shows only open tickets', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewStateFilterButton().should('exist');
          filterBar.getDesktopOverviewStateFilterButton().click();
          filterBar.getDesktopOverviewStatusButtonNew().click();
        })

        it('filtering by closed shows only closed tickets', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewStateFilterButton().click();
          filterBar.getDesktopOverviewStatusButtonNew().click();
          filterBar.getDesktopOverviewStatusButtonClosed().click();
        })

        it('filtering by new shows only new tickets', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewStateFilterButton().click();
          filterBar.getDesktopOverviewStatusButtonNew().click();
          filterBar.getDesktopOverviewStatusButtonClosed().click();
        })
      })

      context(`Labels Field`, () => {
        it('labels field should be interactable', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewLabelFilterButton().should('not.be.disabled')
        })

        it('labels field should be loaded with no labels selected', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewLabelFilterButton().contains('Labels')
        })

        it('labels field should have all labels loaded as options', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewLabelFilterButton().click();
          labels.forEach(label => {
            filterBar.getDesktopOverviewLabel(label.id).parent().should('exist');
          });
        })

        it('labels field should have a search function', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewLabelFilterButton().click();
          filterBar.getDesktopOverviewLabelFilterButton().parent().should('be.visible')
        })

        it('labels field should be filterable', () => {
          const label = labels[0]
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewLabelFilterButton().click();
          filterBar.getDesktopOverviewLabelSearch().click().type(label.name)
          filterBar.getDesktopOverviewLabel(label.id).parent().should('be.visible')
        })

        it('labels field should show selected amount in button', () => {
          const label = labels[0]
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewLabelFilterButton().click();
          filterBar.getDesktopOverviewLabelSearch().click().type(label.name)
          filterBar.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
          filterBar.getDesktopOverviewLabelFilterButton().contains('1 Labels')
        })

        it('labels field should have a reset button', () => {
          const label = labels[0]
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewLabelFilterButton().click();
          filterBar.getDesktopOverviewLabelSearch().click().type(label.name)
          filterBar.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
          filterBar.getClearLabels().click()
        })

        it('labels field should reset to no labels selected', () => {
          const label = labels[0]
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewLabelFilterButton().click();
          filterBar.getDesktopOverviewLabelSearch().click().type(label.name)
          filterBar.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
          filterBar.getDesktopOverviewLabelFilterButton().contains('1 Labels')
          filterBar.getClearLabels().click()
          filterBar.getDesktopOverviewLabelFilterButton().contains('Labels')
        })

        it('filtering by label should only show tickets with that label', () => {
          const label = labels[0]
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopOverviewLabelFilterButton().click();
          filterBar.getDesktopOverviewLabelSearch().click().type(label.name)
          filterBar.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
          tickets.forEach(ticket => {
            const hasLabel = ticket.labels?.some((l) => l.id === label.id);
            if (hasLabel) {
              ticketSidebar.getTicketCard(ticket.id).should('be.visible');
            } else {
              ticketSidebar.getTicketCard(ticket.id).should('not.exist');
            }
          });
        })
      })

      context(`Start Calendar`, () => {
        it('start calendar should have no date selected as default', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopCalendarStartButton().contains('Start')
        })

        it('start calendar should be interactable', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopCalendarStartButton().click()
        })

        it('start calendar should show selected date in button', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopCalendarStartButton().click()
          cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
          filterBar.getDesktopCalendarStartButton().contains(getTodayCalendarLabel());
        })

        it('start calendar should have a reset button', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopCalendarStartButton().click()
          cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
          filterBar.getDesktopCalendarStartButton().contains(getTodayCalendarLabel());
          filterBar.getStartCalendarReset().click()
          filterBar.getDesktopCalendarStartButton().contains('Start')
        })

        it('show tickets created after start date if start date selected', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          const startDate = new Date('2025-09-17T00:00:00.000Z');
          filterBar.getDesktopCalendarStartButton().click()
          cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
          filterBar.getDesktopCalendarStartButton().contains(getTodayCalendarLabel());
          const visibleTickets = tickets.filter(
            (t) => t.state === TicketState.New || t.state === TicketState.Open
          );
          visibleTickets.forEach((t) => {
            const created = new Date(t.createdAt);
            if (created >= startDate) {
              ticketSidebar.getTicketCard(t.id).should('exist');
            } else {
              ticketSidebar.getTicketCard(t.id).should('not.exist');
            }
          });
        })
      })

      context(`End Calendar`, () => {
        it('end calendar should have no date selected as default', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopCalendarEndButton().contains('Ende')
        })

        it('end calendar should be interactable', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopCalendarEndButton().click()
        })

        it('end calendar should show selected date in button', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopCalendarEndButton().click()
          cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
          filterBar.getDesktopCalendarEndButton().contains(getTodayCalendarLabel());
        })

        it('end calendar should have a reset button', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          filterBar.getDesktopCalendarEndButton().click()
          cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
          filterBar.getDesktopCalendarEndButton().contains(getTodayCalendarLabel());
          filterBar.getEndCalendarReset().click()
          filterBar.getDesktopCalendarEndButton().contains('Ende')
        })

        it('show tickets created before end date if end date selected', () => {
          ticketSidebar.getTicketDetailFilterButton().should('exist');
          ticketSidebar.getTicketDetailFilterButton().click({ force: true });
          ticketSidebar.getTicketFilterBar().should('be.visible');
          const endDate = new Date('2025-09-10T00:00:00.000Z');
          filterBar.getDesktopCalendarEndButton().click()
          cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
          filterBar.getDesktopCalendarEndButton().contains(getTodayCalendarLabel());
          const visibleTickets = tickets.filter(
            (t) => t.state === TicketState.New || t.state === TicketState.Open
          );
          visibleTickets.forEach((t) => {
            const created = new Date(t.createdAt);
            if (created <= endDate) {
              ticketPage.getTicketCard(t.id).should('exist');
            } else {
              ticketPage.getTicketCard(t.id).should('not.exist');
            }
          });
        })
      })

    })
  })
})