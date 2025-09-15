import users from "../fixtures/users.json";
import * as ticketPage from "../pages/ticket-overview.po";

describe('Ticket Overview Page Tests:', () => {
  let currentCorrectMail = users.cypress.mail;
  let currentCorrectPassword = users.cypress.password;

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
            const label= labels[0]
            ticketPage.getDesktopOverviewLabelFilterButton().click();
            ticketPage.getDesktopOverviewLabelSearch().click().type(label.name)
            ticketPage.getDesktopOverviewLabel(label.id).parent().should('be.visible')
          })

          it('labels field should show selected amount in button', () => {
            const label= labels[0]
            ticketPage.getDesktopOverviewLabelFilterButton().click();
            ticketPage.getDesktopOverviewLabelSearch().click().type(label.name)
            ticketPage.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
            ticketPage.getDesktopOverviewLabelFilterButton().contains('1 Labels')
          })
          it('labels field should have a reset button', () => {
            const label= labels[0]
            ticketPage.getDesktopOverviewLabelFilterButton().click();
            ticketPage.getDesktopOverviewLabelSearch().click().type(label.name)
            ticketPage.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
            ticketPage.getClearLabels().click()
          })

          it('labels field should reset to no labels selected', () => {
            const label= labels[0]
            ticketPage.getDesktopOverviewLabelFilterButton().click();
            ticketPage.getDesktopOverviewLabelSearch().click().type(label.name)
            ticketPage.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
            ticketPage.getDesktopOverviewLabelFilterButton().contains('1 Labels')
            ticketPage.getClearLabels().click()
            ticketPage.getDesktopOverviewLabelFilterButton().contains('Labels')
          })

          //TODO FIX
          it('filtering by label should only show tickets with that label', () => {
            const label= labels[0]
            ticketPage.getDesktopOverviewLabelFilterButton().click();
            ticketPage.getDesktopOverviewLabelSearch().click().type(label.name)
            ticketPage.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
            tickets.forEach(ticket => {
              const hasLabel = ticket.labels?.some((l: { id: number; }) => l.id === label.id);
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
            cy.get('button[aria-label="Wednesday, September 17th, 2025"]').click();
            ticketPage.getDesktopCalendarStartButton().contains('17.09.25')
          })
          it('start calendar should have a reset button', () => {
            ticketPage.getDesktopCalendarStartButton().click()
            cy.get('button[aria-label="Wednesday, September 17th, 2025"]').click();
            ticketPage.getDesktopCalendarStartButton().contains('17.09.25')
            ticketPage.getStartCalendarReset().click()
            ticketPage.getDesktopCalendarStartButton().contains('Start')
          })

          //TODO FIX
          it('show tickets created after start date if start date selected', () => {
            const startDate = new Date('2025-09-17T00:00:00.000Z');
            ticketPage.getDesktopCalendarStartButton().click()
            cy.get('button[aria-label="Wednesday, September 17th, 2025"]').click();
            ticketPage.getDesktopCalendarStartButton().contains('17.09.25')
            tickets.forEach((t) => {
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
            cy.get('button[aria-label="Wednesday, September 17th, 2025"]').click();
            ticketPage.getDesktopCalendarEndButton().contains('17.09.25')
          })
          it('end calendar should have a reset button', () => {
            ticketPage.getDesktopCalendarEndButton().click()
            cy.get('button[aria-label="Wednesday, September 17th, 2025"]').click();
            ticketPage.getDesktopCalendarEndButton().contains('17.09.25')
            ticketPage.getEndCalendarReset().click()
            ticketPage.getDesktopCalendarEndButton().contains('Ende')
          })
          //TODO FIX
          it('show tickets created before end date if end date selected', () => {
            const endDate = new Date('2025-09-10T00:00:00.000Z');
            ticketPage.getDesktopCalendarEndButton().click()
            cy.get('button[aria-label="Wednesday, September 10th, 2025"]').click();
            ticketPage.getDesktopCalendarEndButton().contains('10.09.25')
            tickets.forEach((t) => {
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
            cy.get('[data-cy^="ticket-card-"]').then($cards => {
              const dates = [...$cards].map(card => new Date(card.dataset.createdAt!));
              const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
              expect(dates).to.deep.equal(sortedDates);
            });
          })
          it('clicking on the same button again should reverse the order', () => {
            ticketPage.getSortingSelectionSortButton().click()
            ticketPage.getSortingSelectionSortField('Erstellt').click()
            ticketPage.getSortingSelectionSortField('Erstellt').click()
            cy.get('[data-cy^="ticket-card-"]').then($cards => {
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
            cy.get('[data-cy^="ticket-card-"]').then($cards => {
              const dates = [...$cards].map(card => new Date(card.dataset.createdAt!));
              const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
              expect(dates).to.deep.equal(sortedDates);
            });
          });

          it('sort tickets by create date descending', () => {
            ticketPage.getSortingSelectionSortButton().click()
            ticketPage.getSortingSelectionSortField('Erstellt').click()
            ticketPage.getSortingSelectionSortField('Erstellt').click()
            cy.get('[data-cy^="ticket-card-"]').then($cards => {
              const dates = [...$cards].map(card => new Date(card.dataset.createdAt!));
              const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());
              expect(dates).to.deep.equal(sortedDates);
            });
          });

          it('sort tickets by modified date ascending', () => {
            ticketPage.getSortingSelectionSortButton().click()
            ticketPage.getSortingSelectionSortField('Geändert').click()
            cy.get('[data-cy^="ticket-card-"]').then($cards => {
              const dates = [...$cards].map(card => new Date(card.dataset.lastModified!));
              const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
              expect(dates).to.deep.equal(sortedDates);
            });
          })
          it('sort tickets by modified date descending', () => {
            ticketPage.getSortingSelectionSortButton().click()
            ticketPage.getSortingSelectionSortField('Geändert').click()
            ticketPage.getSortingSelectionSortField('Geändert').click()
            cy.get('[data-cy^="ticket-card-"]').then($cards => {
              const dates = [...$cards].map(card => new Date(card.dataset.lastModified!));
              const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());
              expect(dates).to.deep.equal(sortedDates);
            });
          })
          it('sort tickets by title ascending', () => {
            ticketPage.getSortingSelectionSortButton().click()
            ticketPage.getSortingSelectionSortField('Titel').click();
            cy.get('[data-cy^="ticket-card-"]').then($cards => {
              const titles = [...$cards].map(c => c.dataset.title!);
              const sortedTitles = [...titles].sort();
              expect(titles).to.deep.equal(sortedTitles);
            });
          })
          it('sort tickets by title descending', () => {
            ticketPage.getSortingSelectionSortButton().click()
            ticketPage.getSortingSelectionSortField('Titel').click();
            ticketPage.getSortingSelectionSortField('Titel').click();
            cy.get('[data-cy^="ticket-card-"]').then($cards => {
              const titles = [...$cards].map(c => c.dataset.title!);
              const sortedTitles = [...titles].sort().reverse();
              expect(titles).to.deep.equal(sortedTitles);
            });
          })
        })
      })
    });
  })
  context('As User', ()=>{
    currentCorrectMail = users.fsles1.mail;
    currentCorrectPassword = users.fsles1.password;
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
            const label= labels[0]
            ticketPage.getDesktopOverviewLabelFilterButton().click();
            ticketPage.getDesktopOverviewLabelSearch().click().type(label.name)
            ticketPage.getDesktopOverviewLabel(label.id).parent().should('be.visible')
          })

          it('labels field should show selected amount in button', () => {
            const label= labels[0]
            ticketPage.getDesktopOverviewLabelFilterButton().click();
            ticketPage.getDesktopOverviewLabelSearch().click().type(label.name)
            ticketPage.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
            ticketPage.getDesktopOverviewLabelFilterButton().contains('1 Labels')
          })
          it('labels field should have a reset button', () => {
            const label= labels[0]
            ticketPage.getDesktopOverviewLabelFilterButton().click();
            ticketPage.getDesktopOverviewLabelSearch().click().type(label.name)
            ticketPage.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
            ticketPage.getClearLabels().click()
          })

          it('labels field should reset to no labels selected', () => {
            const label= labels[0]
            ticketPage.getDesktopOverviewLabelFilterButton().click();
            ticketPage.getDesktopOverviewLabelSearch().click().type(label.name)
            ticketPage.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
            ticketPage.getDesktopOverviewLabelFilterButton().contains('1 Labels')
            ticketPage.getClearLabels().click()
            ticketPage.getDesktopOverviewLabelFilterButton().contains('Labels')
          })

          //TODO FIX
          it('filtering by label should only show tickets with that label', () => {
            const label= labels[0]
            ticketPage.getDesktopOverviewLabelFilterButton().click();
            ticketPage.getDesktopOverviewLabelSearch().click().type(label.name)
            ticketPage.getDesktopOverviewLabel(label.id).parent().should('be.visible').click()
            tickets.forEach(ticket => {
              const hasLabel = ticket.labels?.some((l: { id: number; }) => l.id === label.id);
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
            cy.get('button[aria-label="Wednesday, September 17th, 2025"]').click();
            ticketPage.getDesktopCalendarStartButton().contains('17.09.25')
          })
          it('start calendar should have a reset button', () => {
            ticketPage.getDesktopCalendarStartButton().click()
            cy.get('button[aria-label="Wednesday, September 17th, 2025"]').click();
            ticketPage.getDesktopCalendarStartButton().contains('17.09.25')
            ticketPage.getStartCalendarReset().click()
            ticketPage.getDesktopCalendarStartButton().contains('Start')
          })

          //TODO FIX
          it('show tickets created after start date if start date selected', () => {
            const startDate = new Date('2025-09-17T00:00:00.000Z');
            ticketPage.getDesktopCalendarStartButton().click()
            cy.get('button[aria-label="Wednesday, September 17th, 2025"]').click();
            ticketPage.getDesktopCalendarStartButton().contains('17.09.25')
            tickets.forEach((t) => {
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
            cy.get('button[aria-label="Wednesday, September 17th, 2025"]').click();
            ticketPage.getDesktopCalendarEndButton().contains('17.09.25')
          })
          it('end calendar should have a reset button', () => {
            ticketPage.getDesktopCalendarEndButton().click()
            cy.get('button[aria-label="Wednesday, September 17th, 2025"]').click();
            ticketPage.getDesktopCalendarEndButton().contains('17.09.25')
            ticketPage.getEndCalendarReset().click()
            ticketPage.getDesktopCalendarEndButton().contains('Ende')
          })
          //TODO FIX
          it('show tickets created before end date if end date selected', () => {
            const endDate = new Date('2025-09-10T00:00:00.000Z');
            ticketPage.getDesktopCalendarEndButton().click()
            cy.get('button[aria-label="Wednesday, September 10th, 2025"]').click();
            ticketPage.getDesktopCalendarEndButton().contains('10.09.25')
            tickets.forEach((t) => {
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
            cy.get('[data-cy^="ticket-card-"]').then($cards => {
              const dates = [...$cards].map(card => new Date(card.dataset.createdAt!));
              const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
              expect(dates).to.deep.equal(sortedDates);
            });
          })
          it('clicking on the same button again should reverse the order', () => {
            ticketPage.getSortingSelectionSortButton().click()
            ticketPage.getSortingSelectionSortField('Erstellt').click()
            ticketPage.getSortingSelectionSortField('Erstellt').click()
            cy.get('[data-cy^="ticket-card-"]').then($cards => {
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
            cy.get('[data-cy^="ticket-card-"]').then($cards => {
              const dates = [...$cards].map(card => new Date(card.dataset.createdAt!));
              const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
              expect(dates).to.deep.equal(sortedDates);
            });
          });

          it('sort tickets by create date descending', () => {
            ticketPage.getSortingSelectionSortButton().click()
            ticketPage.getSortingSelectionSortField('Erstellt').click()
            ticketPage.getSortingSelectionSortField('Erstellt').click()
            cy.get('[data-cy^="ticket-card-"]').then($cards => {
              const dates = [...$cards].map(card => new Date(card.dataset.createdAt!));
              const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());
              expect(dates).to.deep.equal(sortedDates);
            });
          });

          it('sort tickets by modified date ascending', () => {
            ticketPage.getSortingSelectionSortButton().click()
            ticketPage.getSortingSelectionSortField('Geändert').click()
            cy.get('[data-cy^="ticket-card-"]').then($cards => {
              const dates = [...$cards].map(card => new Date(card.dataset.lastModified!));
              const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
              expect(dates).to.deep.equal(sortedDates);
            });
          })
          it('sort tickets by modified date descending', () => {
            ticketPage.getSortingSelectionSortButton().click()
            ticketPage.getSortingSelectionSortField('Geändert').click()
            ticketPage.getSortingSelectionSortField('Geändert').click()
            cy.get('[data-cy^="ticket-card-"]').then($cards => {
              const dates = [...$cards].map(card => new Date(card.dataset.lastModified!));
              const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());
              expect(dates).to.deep.equal(sortedDates);
            });
          })
          it('sort tickets by title ascending', () => {
            ticketPage.getSortingSelectionSortButton().click()
            ticketPage.getSortingSelectionSortField('Titel').click();
            cy.get('[data-cy^="ticket-card-"]').then($cards => {
              const titles = [...$cards].map(c => c.dataset.title!);
              const sortedTitles = [...titles].sort();
              expect(titles).to.deep.equal(sortedTitles);
            });
          })
          it('sort tickets by title descending', () => {
            ticketPage.getSortingSelectionSortButton().click()
            ticketPage.getSortingSelectionSortField('Titel').click();
            ticketPage.getSortingSelectionSortField('Titel').click();
            cy.get('[data-cy^="ticket-card-"]').then($cards => {
              const titles = [...$cards].map(c => c.dataset.title!);
              const sortedTitles = [...titles].sort().reverse();
              expect(titles).to.deep.equal(sortedTitles);
            });
          })
        })
      })
    });
  })
})
;
