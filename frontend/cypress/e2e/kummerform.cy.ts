import * as kummerform from "../pages/kummerform.po";
import users from "../fixtures/users.json";
import kummerformstrings from "../fixtures/kummerform.json";
import * as tickets from "../pages/ticket-overview.po"

describe("Kummerform Page", () => {
  let formLabels: any[] = [];
  let qaps: any[] = [];
  let testTitle: string = "testtitle";
  let testText: string = "testext";

  beforeEach(() => {
    cy.getFormLabels().then((fetchedFormLabels) => {
      formLabels = fetchedFormLabels;
    });

    cy.getAllQAPs().then((fetchedQAPs) => {
      qaps = fetchedQAPs;
    });

    cy.visit("/");
  });

  context("page elements", () => {
    it("should load the kummerform page correctly", () => {
      kummerform.getAboutText().should("exist");
      for (let i = 0; i < formLabels.length; i++) {
        kummerform.getFormLabelCheckbox(formLabels[i].id).should("be.visible");
        kummerform.getLabels().contains(formLabels[i].name).should("be.visible");
      }
      
      if (qaps.length > 0) {
        for (let i = 0; i < qaps.length; i++) {
         kummerform.getQAPs(qaps[i].id).should("be.visible"); 
        }
      } else {
        kummerform.QAPEmpty().should("be.visible");
      }
    });

    it("should display form inputs", () => {
      kummerform.getTitleInput().should("be.visible");
      kummerform.getTextInput().should("be.visible");
    });

    it("should display buttons", () => {
      for (let i = 0; i < formLabels.length; i++) {
        kummerform.getFormLabelCheckbox(formLabels[0].id).should("be.visible").and('not.be.disabled');
      }
      kummerform.getSendButton().should("be.visible").and('not.be.disabled');
      kummerform.getThemeToggle().should("be.visible");
    });

    it('should change theme', () => {
          const lightModeRgb = 'rgb(255, 255, 255)'
          const darkModeRgb = 'rgb(10, 10, 10)'
    
          cy.get('body')
            .invoke('css', 'background-color')
            .then((initialBg) => {
              kummerform.getThemeToggle().click()
    
              cy.get('body')
                .invoke('css', 'background-color')
                .should((newBg) => {
                  if (initialBg.toString() === lightModeRgb) expect(newBg).to.equal(darkModeRgb);
                  else expect(newBg).to.equal(lightModeRgb);
                });
            });
        });
  });

  context("send kummerform", () => {

    it("shows no error on empty form - no submit", () => {
      kummerform.getLabelsMessage().should("not.exist");
      kummerform.getTitleMessage().should("not.exist");
      kummerform.getTextMessage().should("not.exist");
    });

    it("shows error and disables submit on invalid submit - empty form", () => {
      kummerform.submit();

      kummerform.getLabelsMessage().should("be.visible").and("contain", "Bitte wähle mindestens ein Label aus.");
      kummerform.getTitleMessage().should("be.visible").and("contain", "Die Zusammenfassung darf nicht leer sein.");
      kummerform.getTextMessage().should("be.visible").and("contain", "Die Nachricht darf nicht leer sein.");
      kummerform.getSendButton().should("be.disabled");
    });

    it("shows error and disables submit on invalid submit - empty labels", () => {
      kummerform.fillOutForm({title: testTitle, text: testText});
      kummerform.submit();

      kummerform.getLabelsMessage().should("be.visible").and("contain", "Bitte wähle mindestens ein Label aus.");
      kummerform.getTitleMessage().should("not.exist");
      kummerform.getTextMessage().should("not.exist");
      kummerform.getSendButton().should("be.disabled");
    });

    it("shows error and disables submit on invalid submit - empty title", () => {
      kummerform.fillOutForm({
        formLabelVal: [true, false, false, false],
        formLabelArray: formLabels,
        text: testText,
      });
      kummerform.submit();

      kummerform.getLabelsMessage().should("not.exist");
      kummerform.getTitleMessage().should("be.visible").and("contain", "Die Zusammenfassung darf nicht leer sein.");
      kummerform.getTextMessage().should("not.exist");
      kummerform.getSendButton().should("be.disabled");
    });

    it("shows error and disables submit on invalid submit - empty text", () => {
      kummerform.fillOutForm({
        formLabelVal: [true, false, false, false],
        formLabelArray: formLabels,
        title: testTitle,
      });
      kummerform.submit();

      kummerform.getLabelsMessage().should("not.exist");
      kummerform.getTitleMessage().should("not.exist");
      kummerform.getTextMessage().should("be.visible").and("contain", "Die Nachricht darf nicht leer sein.");
      kummerform.getSendButton().should("be.disabled");
    });

    it("does not allow title input size over 70", () => {
      kummerform.fillOutForm({ title: kummerformstrings.maxLength.title });
      kummerform.getTitleInputLength().should("have.length", 70);
      kummerform.getSendButton().should("not.be.disabled");
    });

    it ('does not allow text input size over 3000', () => {
      kummerform.getTextInput().type(kummerformstrings.maxLength.text, {delay: 0});
      kummerform.getTextInputLength().should("have.length", 3000);
      kummerform.getSendButton().should('not.be.disabled');
    });

    it("should have sent a ticket with valid inputs", () => {
      kummerform.fillOutForm({
        formLabelVal: [true, false, true, false],
        formLabelArray: formLabels,
        title: testTitle,
        text: testText,
      });
      kummerform.submit();
      kummerform.getLabelsMessage().should("not.exist");
      kummerform.getTitleMessage().should("not.exist");
      kummerform.getTextMessage().should("not.exist");

      cy.login(users.admin.mail, users.admin.password);
      cy.visit("/tickets");
      tickets.checkTicketExistence(testTitle).should("exist");
    });

    it("should reset the form on valid inputs", () => {
      kummerform.fillOutForm({
        formLabelVal: [false, false, true, false],
        formLabelArray: formLabels,
        title: testTitle,
        text: testText,
      });
      kummerform.submit();

      kummerform.getLabelsMessage().should("not.exist");
      for (let i = 0; i < formLabels.length; i++) {
        kummerform.getFormLabelCheckbox(formLabels[i].id).should("not.be.checked");
      }
      kummerform.getTitleMessage().should("not.exist");
      kummerform.getTitleInputLength().should("have.length", 0);
      kummerform.getTextMessage().should("not.exist");
      kummerform.getTextInputLength().should("have.length", 0);
      kummerform.getSendButton().should('not.be.disabled');
    });

    after(() => {
      cy.deleteFormTickets(testTitle);
      cy.visit("/tickets");
      tickets.checkTicketExistence(testTitle).should("not.exist");
    });
  });
});
