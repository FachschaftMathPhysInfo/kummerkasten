import * as ticketPage from "../pages/ticket-overview.po";
import {Label, Ticket, TicketState, UserRole} from "../../lib/graph/generated/graphql";
import {getTodayCalendarLabel, getTodaySuffixForCalendar} from "../pages/ticket-overview.po";

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
              ticketPage.getDesktopOverviewStatusButtonClosed().should('not.exist')
              ticketPage.getDesktopOverviewStatusButtonNew().should('not.exist')
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
              ticketPage.getDesktopOverviewLabelFilterButton().should('not.be.disabled')
            })

            it('labels field should be loaded with no labels selected', () => {
              ticketPage.getDesktopOverviewLabelFilterButton().contains('Labels')
            })

            it('labels field should have all labels loaded as options', () => {
              ticketPage.getDesktopOverviewLabelFilterButton().click();
              labels.forEach(label => {
                ticketPage.getDesktopOverviewLabel(label.id).parent().should('exist');
              });
            })

            it('labels field should have a search function', () => {
              ticketPage.getDesktopOverviewLabelFilterButton().click();
              ticketPage.getDesktopOverviewLabelFilterButton().parent().should('be.visible')
            })

            it('labels field should be filterable', () => {
              const label = labels[0]
              ticketPage.getDesktopOverviewLabelFilterButton().click();
              ticketPage.getDesktopOverviewLabelSearch().click().type(label.name)
              ticketPage.getDesktopOverviewLabel(label.id).parent().should('be.visible')
            })

            it('labels field should show selected amount in button', () => {
              const label = labels[0]
              ticketPage.getDesktopOverviewLabelFilterButton().click();
              ticketPage.getDesktopOverviewLabelSearch().click().type(label.name)
              ticketPage.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
              ticketPage.getDesktopOverviewLabelFilterButton().contains('1 Labels')
            })

            it('labels field should have a reset button', () => {
              const label = labels[0]
              ticketPage.getDesktopOverviewLabelFilterButton().click();
              ticketPage.getDesktopOverviewLabelSearch().click().type(label.name)
              ticketPage.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
              ticketPage.getClearLabels().click()
            })

            it('labels field should reset to no labels selected', () => {
              const label = labels[0]
              ticketPage.getDesktopOverviewLabelFilterButton().click();
              ticketPage.getDesktopOverviewLabelSearch().click().type(label.name)
              ticketPage.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
              ticketPage.getDesktopOverviewLabelFilterButton().contains('1 Labels')
              ticketPage.getClearLabels().click()
              ticketPage.getDesktopOverviewLabelFilterButton().contains('Labels')
            })

            it('filtering by label should only show tickets with that label', () => {
              const label = labels[0]
              ticketPage.getDesktopOverviewLabelFilterButton().click();
              ticketPage.getDesktopOverviewLabelSearch().click().type(label.name)
              ticketPage.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
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
              ticketPage.getDesktopCalendarStartButton().contains('Start')
            })

            it('start calendar should be interactable', () => {
              ticketPage.getDesktopCalendarStartButton().click()
            })

            it('start calendar should show selected date in button', () => {
              ticketPage.getDesktopCalendarStartButton().click()
              cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
              ticketPage.getDesktopCalendarStartButton().contains(getTodayCalendarLabel());
            })

            it('start calendar should have a reset button', () => {
              ticketPage.getDesktopCalendarStartButton().click()
              cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
              ticketPage.getDesktopCalendarStartButton().contains(getTodayCalendarLabel());
              ticketPage.getStartCalendarReset().click()
              ticketPage.getDesktopCalendarStartButton().contains('Start')
            })

            it('show tickets created after start date if start date selected', () => {
              const startDate = new Date('2025-09-17T00:00:00.000Z');
              ticketPage.getDesktopCalendarStartButton().click()
              cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
              ticketPage.getDesktopCalendarStartButton().contains(getTodayCalendarLabel());
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
              ticketPage.getDesktopCalendarEndButton().contains('Ende')
            })

            it('end calendar should be interactable', () => {
              ticketPage.getDesktopCalendarEndButton().click()
            })

            it('end calendar should show selected date in button', () => {
              ticketPage.getDesktopCalendarEndButton().click()
              cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
              ticketPage.getDesktopCalendarEndButton().contains(getTodayCalendarLabel());
            })

            it('end calendar should have a reset button', () => {
              ticketPage.getDesktopCalendarEndButton().click()
              cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
              ticketPage.getDesktopCalendarEndButton().contains(getTodayCalendarLabel());
              ticketPage.getEndCalendarReset().click()
              ticketPage.getDesktopCalendarEndButton().contains('Ende')
            })

            it('show tickets created before end date if end date selected', () => {
              const endDate = new Date('2025-09-10T00:00:00.000Z');
              ticketPage.getDesktopCalendarEndButton().click()
              cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
              ticketPage.getDesktopCalendarEndButton().contains(getTodayCalendarLabel());
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
              ticketPage.getSortingSelectionSortButton().click()
            })

            it('sorting button should have 3 sorting values', () => {
              ticketPage.getSortingSelectionSortButton().click()
              ticketPage.getSortingSelectionSortField('Erstellt').should('exist');
              ticketPage.getSortingSelectionSortField('Geändert').should('exist');
              ticketPage.getSortingSelectionSortField('Titel').should('exist');
            })

            it('selecting a sorting order should show tickets in that order', () => {
              ticketPage.getSortingSelectionSortButton().click()
              ticketPage.getSortingSelectionSortField('Erstellt').click()
              cy.get('[data-cy^="ticket-card-id"]').then($cards => {
                const dates = [...$cards].map(card => new Date(card.dataset.createdAt!));
                const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
                expect(dates).to.deep.equal(sortedDates);
              });
            })

            it('clicking on the same button again should reverse the order', () => {
              ticketPage.getSortingSelectionSortButton().click()
              ticketPage.getSortingSelectionSortField('Erstellt').click()
              ticketPage.getSortingSelectionSortField('Erstellt').click()
              cy.get('[data-cy^="ticket-card-id"]').then($cards => {
                const dates = [...$cards].map(card => new Date(card.dataset.createdAt!));
                const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());
                expect(dates).to.deep.equal(sortedDates);
              });
            })

            it('show sorting type and order in button', () => {
              ticketPage.getSortingSelectionSortButton().click()
              ticketPage.getSortingSelectionSortField('Erstellt').click()
              ticketPage.getSortingSelectionSortButton().contains('Erstellt');
            })

            it('sort tickets by create date ascending', () => {
              ticketPage.getSortingSelectionSortButton().click()
              ticketPage.getSortingSelectionSortField('Erstellt').click()
              cy.get('[data-cy^="ticket-card-id"]').then($cards => {
                const dates = [...$cards].map(card => new Date(card.dataset.createdAt!));
                const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
                expect(dates).to.deep.equal(sortedDates);
              });
            });

            it('sort tickets by create date descending', () => {
              ticketPage.getSortingSelectionSortButton().click()
              ticketPage.getSortingSelectionSortField('Erstellt').click()
              ticketPage.getSortingSelectionSortField('Erstellt').click()
              cy.get('[data-cy^="ticket-card-id"]').then($cards => {
                const dates = [...$cards].map(card => new Date(card.dataset.createdAt!));
                const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());
                expect(dates).to.deep.equal(sortedDates);
              });
            });

            it('sort tickets by modified date ascending', () => {
              ticketPage.getSortingSelectionSortButton().click()
              ticketPage.getSortingSelectionSortField('Geändert').click()
              cy.get('[data-cy^="ticket-card-id"]').then($cards => {
                const dates = [...$cards].map(card => new Date(card.dataset.lastModified!));
                const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
                expect(dates).to.deep.equal(sortedDates);
              });
            })

            it('sort tickets by modified date descending', () => {
              ticketPage.getSortingSelectionSortButton().click()
              ticketPage.getSortingSelectionSortField('Geändert').click()
              ticketPage.getSortingSelectionSortField('Geändert').click()
              cy.get('[data-cy^="ticket-card-id"]').then($cards => {
                const dates = [...$cards].map(card => new Date(card.dataset.lastModified!));
                const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());
                expect(dates).to.deep.equal(sortedDates);
              });
            })

            it('sort tickets by title ascending', () => {
              ticketPage.getSortingSelectionSortButton().click()
              ticketPage.getSortingSelectionSortField('Titel').click();
              cy.get('[data-cy^="ticket-card-id"]').then($cards => {
                const titles = [...$cards].map(c => c.dataset.title!);
                const sortedTitles = [...titles].sort();
                expect(titles).to.deep.equal(sortedTitles);
              });
            })

            it('sort tickets by title descending', () => {
              ticketPage.getSortingSelectionSortButton().click()
              ticketPage.getSortingSelectionSortField('Titel').click();
              ticketPage.getSortingSelectionSortField('Titel').click();
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
              ticketPage.getDesktopOverviewStateFilterButton().click();
              ticketPage.getDesktopOverviewStatusButtonClosed().click();
              ticketPage.getDesktopOverviewLabelFilterButton().click();
              ticketPage.getDesktopOverviewLabel(labels[0].id).parent().click();
              ticketPage.getDesktopCalendarStartButton().click();
              cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();
              ticketPage.getDesktopCalendarEndButton().click();
              cy.get('button[aria-label="Today, ' + getTodaySuffixForCalendar() + '"]').click();

              ticketPage.getDesktopOverviewResetFilters().should('be.visible').click();
              const visibleTickets = tickets.filter(
                (t) => t.state === TicketState.New || t.state === TicketState.Open
              );

              ticketPage.getDesktopSearchTextInput().should('have.value', '');
              ticketPage.getDesktopOverviewStateFilterButton().contains('2');
              ticketPage.getDesktopOverviewLabelFilterButton().contains('Labels');
              ticketPage.getDesktopCalendarStartButton().contains('Start');
              ticketPage.getDesktopCalendarEndButton().contains('Ende');

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

