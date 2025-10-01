import * as ticketDetail from "../../pages/tickets/ticket-detail.po";
import * as ticketInfoPane from "../../pages/tickets/ticket-info-pane.po";
import * as ticketLabelArea from "../../pages/tickets/ticket-label-area.po";
import * as ticketStatusArea from "../../pages/tickets/ticket-status-area.po";
import * as confirmationDialog from "../../pages/confirmation-dialog.po";
import {Label, TicketState, UserRole} from "../../../lib/graph/generated/graphql";


const roles: UserRole[] = [UserRole.Admin, UserRole.User]

roles.forEach(role => {
  describe('Ticket Detail Tests', () => {
    let labels: Label[] = [];
    let ticketId: string;
    let originalTitle: string;
    let originalState: TicketState;

    context(`${role} Tests`, () => {
      beforeEach(() => {
        cy.loginAsRole(role)
        cy.createTicket({
          originalTitle: "Initial Test Title",
          text: "This is a test ticket",
          labels: [],
        }).then((id) => {
          ticketId = id;
          originalTitle = "Initial Test Title";
          originalState = TicketState.New;
          cy.visit(`/tickets/${ticketId}`);
        });
        cy.getAllLabels().then((fetchedLabels) => {
          labels = fetchedLabels;
        });
      });

      afterEach(() => {
        if (ticketId) {
          cy.visit("/");
          cy.loginAsRole(UserRole.Admin).then(() => {
            cy.deleteTicket(ticketId)
          });
        }
      });

      it(`loads page elements`, () => {
        ticketDetail.getTicketDetailTitle().should('exist');
        ticketDetail.getTicketDetailTitleEdit().should('exist');
        ticketStatusArea.getTicketStatusArea().should('exist');
        ticketLabelArea.getTicketLabelSettings().should('exist');
        if (role === UserRole.Admin) {
          ticketInfoPane.getTicketInfoPaneDelete().should('exist');
        }
      })

      context(`Title`, () => {
        it(`Edit button loads save, cancel and title input`, () => {
          ticketDetail.getTicketDetailTitleEdit().click();
          ticketDetail.getTicketDetailSave().should('exist');
          ticketDetail.getTicketDetailCancel().should('exist');
          ticketDetail.getTicketDetailTitleInput().should('exist');
        })

        it("cancel button resets title changes", () => {
          ticketDetail.getTicketDetailTitleEdit().click();
          ticketDetail.getTicketDetailTitleInput().clear().type("Wrong Title");
          ticketDetail.getTicketDetailCancel().click();
          ticketDetail.getTicketDetailTitle().should("contain.text", originalTitle);
        });

        it("valid save button changes title", () => {
          const newTitle = "This is a new Test Title"
          ticketDetail.getTicketDetailTitleEdit().click();
          ticketDetail.getTicketDetailTitleInput().clear().type(newTitle);
          ticketDetail.getTicketDetailSave().click();
          ticketDetail.getTicketDetailTitle().should("contain.text", newTitle);
        });
      })

      context('Status', () => {
        it("changes to new", () => {
          ticketStatusArea.getTicketStatusArea().click();
          ticketStatusArea.getTicketStatusNew().click();
          ticketStatusArea.getTicketStatusArea().should("contain.text", "Neu");
        });

        it("changes to open", () => {
          ticketStatusArea.getTicketStatusArea().click();
          ticketStatusArea.getTicketStatusOpen().click();
          ticketStatusArea.getTicketStatusArea().should("contain.text", "Offen");
        });

        it("changes to closed", () => {
          ticketStatusArea.getTicketStatusArea().click();
          ticketStatusArea.getTicketStatusClosed().click();
          ticketStatusArea.getTicketStatusArea().should("contain.text", "Fertig");
        });
      })

      if (role === UserRole.Admin) {
        context("Delete", () => {
          it("deletes ticket correctly", () => {
            ticketInfoPane.getTicketInfoPaneDelete().click();
            confirmationDialog.getConfirmButton().click();
            cy.contains(originalTitle).should("not.exist");
          });
        });
      }

      context("Label", () => {
        it("opens label view", () => {
          ticketLabelArea.getTicketLabelSettings().click();
          ticketLabelArea.getLabelSearch().should("exist");
        });

        it("loads all labels", () => {
          ticketLabelArea.getTicketLabelSettings().click();
          labels.forEach((label) => {
            ticketLabelArea.getTicketLabel(label.id).should("exist");
          });
        });

        it("updates labels on save", () => {
          const labelToAdd = labels[0];
          ticketLabelArea.getTicketLabelSettings().click();
          ticketLabelArea.getTicketLabel(labelToAdd.id).click();
          ticketLabelArea.getLabelAreaSave().click();
          cy.contains(labelToAdd.name).should("exist");
        });

        it("searches labels correctly", () => {
          const searchTerm = labels[0].name;
          ticketLabelArea.getTicketLabelSettings().click();
          ticketLabelArea.getLabelSearch().type(searchTerm);
          ticketLabelArea.getTicketLabel(labels[0].id).should("contain.text", searchTerm);
        });
      });
    })
  })
})