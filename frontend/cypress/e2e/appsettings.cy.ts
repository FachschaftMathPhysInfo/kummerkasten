import users from "../fixtures/users.json"
import * as appSettings from "../pages/appsettings.po"
import {FOOTER_CONTACT_LINK_KEY} from "@/app/(settings)/app-settings/footer-form";

describe('App Settings Tests', () => {
  let initialSettings: { FOOTER_CONTACT_LINK: string; FOOTER_LEGAL_NOTICE_LINK: string }
  before(() => {
    cy.getFooterSettings().then((settings) => {
      initialSettings = {
        FOOTER_CONTACT_LINK: settings.FOOTER_CONTACT_LINK ?? "",
        FOOTER_LEGAL_NOTICE_LINK: settings.FOOTER_LEGAL_NOTICE_LINK ?? ""
      }
    });
  })

  beforeEach(() => {
    cy.login(users.admin.mail, users.admin.password)
    cy.visit("/app-settings")
  })

  context('Page Elements', () => {
    it('Initial Values being loaded', () => {
      cy.getFooterSettings().then((settings) => {
        appSettings.getFooterContactInput().should("have.value", settings.FOOTER_CONTACT_LINK ?? "");
        appSettings.getFooterLegalNoticeInput().should("have.value", settings.FOOTER_LEGAL_NOTICE_LINK ?? "");
      });
      appSettings.getFooterSaveButton().should("be.disabled");
    })

    it('Correct Updates on valid inputs and saves', () => {
      const newContact = "https://mathphys.info/kaffee";
      const newLegal = "https://mathphys.info/kaffeeklatsch";
      appSettings.getFooterContactInput().clear().type(newContact);
      appSettings.getFooterLegalNoticeInput().clear().type(newLegal);
      appSettings.getFooterSaveButton().click();
      cy.getFooterSettings().should((settings) => {
        expect(settings.FOOTER_CONTACT_LINK).to.eq(newContact);
        expect(settings.FOOTER_LEGAL_NOTICE_LINK).to.eq(newLegal);
      });
      appSettings.getFooterSaveButton().should('be.disabled');
    })

    it('Cancel button restores initial values', () => {
      cy.getFooterSettings().then((settings) => {
        const originalContact = settings.FOOTER_CONTACT_LINK;
        const originalLegal = settings.FOOTER_LEGAL_NOTICE_LINK;
        appSettings.getFooterContactInput().clear().type("https://mimimimimi.miau");
        appSettings.getFooterLegalNoticeInput().clear().type("https://halloichbin.einlink");
        appSettings.getFooterCancelButton().click();
        appSettings.getFooterContactInput().should("have.value", originalContact);
        appSettings.getFooterLegalNoticeInput().should("have.value", originalLegal);
      });
    });

    it('Shows validation errors on incorrect url format', () => {
      appSettings.getFooterContactInput().clear().type("i-am-not-a-link");
      appSettings.getFooterLegalNoticeInput().clear().type("am-i-a-link?");
      appSettings.getFooterSaveButton().click();
      appSettings.getFooterContactMessage().contains('Bitte gib eine gültige URL an');
      appSettings.getFooterLegalNoticeMessage().contains('Bitte gib eine gültige URL an');
    })
  });
  after(()=>{
    appSettings.getFooterContactInput().clear().type(initialSettings.FOOTER_CONTACT_LINK);
    appSettings.getFooterLegalNoticeInput().clear().type(initialSettings.FOOTER_LEGAL_NOTICE_LINK);
    appSettings.getFooterSaveButton().click();
  })
});