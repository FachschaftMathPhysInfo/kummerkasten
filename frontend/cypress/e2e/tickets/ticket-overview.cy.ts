import * as ticketPage from "../../pages/tickets/ticket-overview.po";
import {getTodayCalendarLabel, getTodaySuffixForCalendar} from "../../pages/tickets/ticket-overview.po";
import * as filterBar from "../../pages/tickets/filter-bar.po";
import {Label, Ticket, TicketState, UserRole} from "../../../lib/graph/generated/graphql";

const roles: UserRole[] = [UserRole.Admin, UserRole.User]


roles.forEach(role => {
  describe('Ticket Overview Page Tests:', () => {
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
          });
          cy.visit("/tickets");
        });
      });

      context('On Desktop', () => {
        context('Loading', () => {
          it('loads the page', () => {
            cy.url().should('include', '/tickets');
          });

          it('loads filter options', () => {
            ticketPage.getDesktopSearchTextInput().should('exist')
            filterBar.getDesktopOverviewStateFilterButton().should('exist')
            filterBar.getDesktopOverviewLabelFilterButton().should('exist')
            filterBar.getDesktopCalendarStartButton().should('exist')
            filterBar.getDesktopCalendarEndButton().should('exist')
            filterBar.getSortingSelectionSortButton().should('exist')
          });

          it('shows filter options', () => {
            ticketPage.getDesktopSearchTextInput().should('be.visible')
            filterBar.getDesktopOverviewStateFilterButton().should('be.visible')
            filterBar.getDesktopOverviewLabelFilterButton().should('be.visible')
            filterBar.getDesktopCalendarStartButton().should('be.visible')
            filterBar.getDesktopCalendarEndButton().should('be.visible')
            filterBar.getSortingSelectionSortButton().should('be.visible')
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
              const visibleTickets = tickets.filter(
                (t) => t.state === TicketState.New || t.state === TicketState.Open
              );
              const closedTickets = tickets.filter(
                (t) => t.state === TicketState.Closed
              );
              visibleTickets.forEach((ticket) => {
                ticketPage.getTicketCard(ticket.id).should('exist').and('be.visible');
              });
              closedTickets.forEach((ticket) => {
                ticketPage.getTicketCard(ticket.id).should('not.exist');
              });
              cy.get('[data-cy^="ticket-card-id"]').should('have.length', visibleTickets.length);
            })

            it('show all tickets with searchterm in title or text', () => {
              const ticket = tickets[0]
              ticketPage.getDesktopSearchTextInput().clear().type(ticket.text);
              ticketPage.getTicketCard(ticket.id).should('exist');
              cy.get('[data-cy^="ticket-card-id"]').should('have.length', 1);
            })

            it('show no tickets for non-existent searchterm', () => {
              ticketPage.getDesktopSearchTextInput().clear().type('NO_SUCH_TICKET');
              cy.get('[data-cy^="ticket-card-id"]').should('have.length', 0);
            })
          })

          context('Status Field', () => {
            it('show tickets with states new or open as default', () => {
              cy.getTicketsByStateNewOrOpen().then((tickets) => {
                tickets.forEach((ticket: any) => {
                  ticketPage.getTicketCard(ticket.id).should('exist').and('be.visible');
                });
                cy.get('[data-cy^="ticket-card-id"]').should('have.length', tickets.length);
              });
            });

            it('status field should be interactable', () => {
              filterBar.getDesktopOverviewStateFilterButton().should('not.be.disabled');
            })

            it('status field should have 3 status buttons', () => {
              filterBar.getDesktopOverviewStateFilterButton().click()
              filterBar.getDesktopOverviewStatusButtonNew().should('be.visible');
              filterBar.getDesktopOverviewStatusButtonOpen().should('be.visible');
              filterBar.getDesktopOverviewStatusButtonClosed().should('be.visible');
            })

            it('status field should have a search bar', () => {
              filterBar.getDesktopOverviewStateFilterButton().click()
              filterBar.getDesktopOverviewStatusFilterSearch().should('be.visible').should('not.be.disabled')
            })

            it('status field should be filterable', () => {
              filterBar.getDesktopOverviewStateFilterButton().click()
              filterBar.getDesktopOverviewStatusFilterSearch().type('Offen')
              filterBar.getDesktopOverviewStatusButtonClosed().should('not.exist')
              filterBar.getDesktopOverviewStatusButtonNew().should('not.exist')
              filterBar.getDesktopOverviewStatusButtonOpen().should('be.visible')
            })

            it('status field should show selected status amount in button', () => {
              filterBar.getDesktopOverviewStateFilterButton().contains('2');
            })

            it('status field should reset to new and open', () => {
              filterBar.getDesktopOverviewStateFilterButton().click();
              filterBar.getDesktopOverviewStatusButtonClosed().click();
              filterBar.getDesktopOverviewStateFilterButton().click();
              ticketPage.getDesktopOverviewResetFilters().click()
              filterBar.getDesktopOverviewStateFilterButton().contains('2');
            })

            it('filtering by open shows only open tickets', () => {
              filterBar.getDesktopOverviewStateFilterButton().click();
              filterBar.getDesktopOverviewStatusButtonNew().click();
            })

            it('filtering by closed shows only closed tickets', () => {
              filterBar.getDesktopOverviewStateFilterButton().click();
              filterBar.getDesktopOverviewStatusButtonNew().click();
              filterBar.getDesktopOverviewStatusButtonClosed().click();
            })

            it('filtering by new shows only new tickets', () => {
              filterBar.getDesktopOverviewStateFilterButton().click();
              filterBar.getDesktopOverviewStatusButtonNew().click();
              filterBar.getDesktopOverviewStatusButtonClosed().click();
            })
          })

          context('Labels Field', () => {
            it('labels field should be interactable', () => {
              filterBar.getDesktopOverviewLabelFilterButton().should('not.be.disabled')
            })

            it('labels field should be loaded with no labels selected', () => {
              filterBar.getDesktopOverviewLabelFilterButton().contains('Labels')
            })

            it('labels field should have all labels loaded as options', () => {
              filterBar.getDesktopOverviewLabelFilterButton().click();
              labels.forEach(label => {
                filterBar.getDesktopOverviewLabel(label.id).parent().should('exist');
              });
            })

            it('labels field should have a search function', () => {
              filterBar.getDesktopOverviewLabelFilterButton().click();
              filterBar.getDesktopOverviewLabelFilterButton().parent().should('be.visible')
            })

            it('labels field should be filterable', () => {
              const label = labels[0]
              filterBar.getDesktopOverviewLabelFilterButton().click();
              filterBar.getDesktopOverviewLabelSearch().click().type(label.name)
              filterBar.getDesktopOverviewLabel(label.id).parent().should('be.visible')
            })

            it('labels field should show selected amount in button', () => {
              const label = labels[0]
              filterBar.getDesktopOverviewLabelFilterButton().click();
              filterBar.getDesktopOverviewLabelSearch().click().type(label.name)
              filterBar.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
              filterBar.getDesktopOverviewLabelFilterButton().contains('1 Labels')
            })

            it('labels field should have a reset button', () => {
              const label = labels[0]
              filterBar.getDesktopOverviewLabelFilterButton().click();
              filterBar.getDesktopOverviewLabelSearch().click().type(label.name)
              filterBar.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
              filterBar.getClearLabels().click()
            })

            it('labels field should reset to no labels selected', () => {
              const label = labels[0]
              filterBar.getDesktopOverviewLabelFilterButton().click();
              filterBar.getDesktopOverviewLabelSearch().click().type(label.name)
              filterBar.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
              filterBar.getDesktopOverviewLabelFilterButton().contains('1 Labels')
              filterBar.getClearLabels().click()
              filterBar.getDesktopOverviewLabelFilterButton().contains('Labels')
            })

            it('filtering by label should only show tickets with that label', () => {
              const label = labels[0]
              filterBar.getDesktopOverviewLabelFilterButton().click();
              filterBar.getDesktopOverviewLabelSearch().click().type(label.name)
              filterBar.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
              tickets.forEach(ticket => {
                const hasLabel = ticket.labels?.some((l) => l.id === label.id);
                if (hasLabel) {
                  ticketPage.getTicketCard(ticket.id).should('be.visible');
                } else {
                  ticketPage.getTicketCard(ticket.id).should('not.exist');
                }
              });
            })
          })

          context('Start Calendar', () => {
            it('start calendar should have no date selected as default', () => {
              filterBar.getDesktopCalendarStartButton().contains('Start')
            })

            it('start calendar should be interactable', () => {
              filterBar.getDesktopCalendarStartButton().click()
            })

            it('start calendar should show selected date in button', () => {
              filterBar.getDesktopCalendarStartButton().click()
              cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
              filterBar.getDesktopCalendarStartButton().contains(getTodayCalendarLabel());
            })

            it('start calendar should have a reset button', () => {
              filterBar.getDesktopCalendarStartButton().click()
              cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
              filterBar.getDesktopCalendarStartButton().contains(getTodayCalendarLabel());
              filterBar.getStartCalendarReset().click()
              filterBar.getDesktopCalendarStartButton().contains('Start')
            })

            it('show tickets created after start date if start date selected', () => {
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
                  ticketPage.getTicketCard(t.id).should('exist');
                } else {
                  ticketPage.getTicketCard(t.id).should('not.exist');
                }
              });
            })
          })

          context('End Calendar', () => {
            it('end calendar should have no date selected as default', () => {
              filterBar.getDesktopCalendarEndButton().contains('Ende')
            })

            it('end calendar should be interactable', () => {
              filterBar.getDesktopCalendarEndButton().click()
            })

            it('end calendar should show selected date in button', () => {
              filterBar.getDesktopCalendarEndButton().click()
              cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
              filterBar.getDesktopCalendarEndButton().contains(getTodayCalendarLabel());
            })

            it('end calendar should have a reset button', () => {
              filterBar.getDesktopCalendarEndButton().click()
              cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
              filterBar.getDesktopCalendarEndButton().contains(getTodayCalendarLabel());
              filterBar.getEndCalendarReset().click()
              filterBar.getDesktopCalendarEndButton().contains('Ende')
            })

            it('show tickets created before end date if end date selected', () => {
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

          context('Sorting', () => {
            it('sorting button should be interactable', () => {
              filterBar.getSortingSelectionSortButton().click()
            })

            it('sorting button should have 3 sorting values', () => {
              filterBar.getSortingSelectionSortButton().click()
              filterBar.getSortingSelectionSortField('Erstellt').should('exist');
              filterBar.getSortingSelectionSortField('Geändert').should('exist');
              filterBar.getSortingSelectionSortField('Titel').should('exist');
            })

            it('selecting a sorting order should show tickets in that order', () => {
              filterBar.getSortingSelectionSortButton().click()
              filterBar.getSortingSelectionSortField('Erstellt').click()
              cy.get('[data-cy^="ticket-card-id"]').then($cards => {
                const dates = [...$cards].map(card => new Date(card.dataset.createdAt!));
                const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
                expect(dates).to.deep.equal(sortedDates);
              });
            })

            it('clicking on the same button again should reverse the order', () => {
              filterBar.getSortingSelectionSortButton().click()
              filterBar.getSortingSelectionSortField('Erstellt').click()
              filterBar.getSortingSelectionSortField('Erstellt').click()
              cy.get('[data-cy^="ticket-card-id"]').then($cards => {
                const dates = [...$cards].map(card => new Date(card.dataset.createdAt!));
                const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());
                expect(dates).to.deep.equal(sortedDates);
              });
            })

            it('show sorting type and order in button', () => {
              filterBar.getSortingSelectionSortButton().click()
              filterBar.getSortingSelectionSortField('Erstellt').click()
              filterBar.getSortingSelectionSortButton().contains('Erstellt');
            })

            it('sort tickets by create date ascending', () => {
              filterBar.getSortingSelectionSortButton().click()
              filterBar.getSortingSelectionSortField('Erstellt').click()
              cy.get('[data-cy^="ticket-card-id"]').then($cards => {
                const dates = [...$cards].map(card => new Date(card.dataset.createdAt!));
                const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
                expect(dates).to.deep.equal(sortedDates);
              });
            });

            it('sort tickets by create date descending', () => {
              filterBar.getSortingSelectionSortButton().click()
              filterBar.getSortingSelectionSortField('Erstellt').click()
              filterBar.getSortingSelectionSortField('Erstellt').click()
              cy.get('[data-cy^="ticket-card-id"]').then($cards => {
                const dates = [...$cards].map(card => new Date(card.dataset.createdAt!));
                const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());
                expect(dates).to.deep.equal(sortedDates);
              });
            });

            it('sort tickets by modified date ascending', () => {
              filterBar.getSortingSelectionSortButton().click()
              filterBar.getSortingSelectionSortField('Geändert').click()
              cy.get('[data-cy^="ticket-card-id"]').then($cards => {
                const dates = [...$cards].map(card => new Date(card.dataset.lastModified!));
                const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
                expect(dates).to.deep.equal(sortedDates);
              });
            })

            it('sort tickets by modified date descending', () => {
              filterBar.getSortingSelectionSortButton().click()
              filterBar.getSortingSelectionSortField('Geändert').click()
              filterBar.getSortingSelectionSortField('Geändert').click()
              cy.get('[data-cy^="ticket-card-id"]').then($cards => {
                const dates = [...$cards].map(card => new Date(card.dataset.lastModified!));
                const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());
                expect(dates).to.deep.equal(sortedDates);
              });
            })

            it('sort tickets by title ascending', () => {
              filterBar.getSortingSelectionSortButton().click()
              filterBar.getSortingSelectionSortField('Titel').click();
              cy.get('[data-cy^="ticket-card-id"]').then($cards => {
                const titles = [...$cards].map(c => c.dataset.title!);
                const sortedTitles = [...titles].sort();
                expect(titles).to.deep.equal(sortedTitles);
              });
            })

            it('sort tickets by title descending', () => {
              filterBar.getSortingSelectionSortButton().click()
              filterBar.getSortingSelectionSortField('Titel').click();
              filterBar.getSortingSelectionSortField('Titel').click();
              cy.get('[data-cy^="ticket-card-id"]').then($cards => {
                const titles = [...$cards].map(c => c.dataset.title!);
                const sortedTitles = [...titles].sort().reverse();
                expect(titles).to.deep.equal(sortedTitles);
              });
            })
          })

          context('general filtering', () => {
            it('should reset all filters when clicked', () => {
              ticketPage.getDesktopSearchTextInput().type('Test');
              filterBar.getDesktopOverviewStateFilterButton().click();
              filterBar.getDesktopOverviewStatusButtonClosed().click();
              filterBar.getDesktopOverviewLabelFilterButton().click();
              filterBar.getDesktopOverviewLabel(labels[0].id).parent().click();
              filterBar.getDesktopCalendarStartButton().click();
              cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
              filterBar.getDesktopCalendarEndButton().click();
              cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();

              ticketPage.getDesktopOverviewResetFilters().should('be.visible').click();
              const visibleTickets = tickets.filter(
                (t) => t.state === TicketState.New || t.state === TicketState.Open
              );

              ticketPage.getDesktopSearchTextInput().should('have.value', '');
              filterBar.getDesktopOverviewStateFilterButton().contains('2');
              filterBar.getDesktopOverviewLabelFilterButton().contains('Labels');
              filterBar.getDesktopCalendarStartButton().contains('Start');
              filterBar.getDesktopCalendarEndButton().contains('Ende');

              cy.get('[data-cy^="ticket-card-id"]').should('have.length', visibleTickets.length);
            });
          });

          context('interaction with ticket card', () => {
            it('loads ticketstate for ticketcard', () => {
              ticketPage.getTicketCard(tickets[0].id).should('exist').and('be.visible')
              ticketPage.getTicketCardState(tickets[0].state).should('exist').and('be.visible')
            });
            it('dropdown menu button exists and is interactable', () => {
              ticketPage.getTicketCardDropdown(tickets[0].id)
                .should('exist')
                .and('be.visible')
                .and('not.be.disabled')
                .click();
            });

            it('dropdown menu has copy option', () => {
              ticketPage.getTicketCardDropdown(tickets[0].id).click();
              ticketPage.getTicketCardCopyButton(tickets[0].id).should('exist');
            });

            it('dropdown menu copy works', () => {
              const ticketID = tickets[0].id;
              ticketPage.getTicketCardDropdown(ticketID).click();
              ticketPage.getTicketCardCopyButton(ticketID).click();
              cy.contains('Link kopiert!').should('be.visible');
            });

            if (role === UserRole.Admin) {
              it('dropdown menu has delete option', () => {
                ticketPage.getTicketCardDropdown(tickets[0].id).click();
                ticketPage.getTicketCardDeleteButton(tickets[0].id).should('exist');
              });

              it('dropwdown menu delete works', () => {
                const ticketID = tickets[0].id;
                ticketPage.getTicketCardDropdown(ticketID).click();
                ticketPage.getTicketCardDeleteButton(ticketID).click();
                ticketPage.getTicketDeleteConfirm().click();
                ticketPage.getTicketCard(ticketID).should('not.exist')
              })
            }
          })
        });
      });
    })
  });
})

