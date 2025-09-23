import * as sidebar from "../pages/sidebar.po"
import {getFooter} from "../pages/footer.po";
import users from "../fixtures/users.json"

describe('Footer Tests', () => {

  context("logged out", () => {
    it('should not be visible on root page', () => {
      cy.visit('/')
      sidebar.getSidebar().should('not.exist')
    });

    it('should not be visible on login page', () => {
      cy.visit('/login')
      sidebar.getSidebar().should('not.exist')
    });
  })

  context.only('logged in as admin', () => {

    beforeEach(() => {
      cy.login(users.admin.mail, users.admin.password)
      cy.visit('/tickets')
    })

    it('should exist when logged in', () => {
      sidebar.getSidebar().should('be.visible')
    });

    it('should be toggleable', () => {
      sidebar.getSidebarTrigger().should('be.visible')
      sidebar.getSidebarTrigger().click()
      sidebar.getSidebar().parent().should('have.attr', 'data-state', 'collapsed')
      sidebar.getSidebarTrigger().click()
      sidebar.getSidebar().parent().should('have.attr', 'data-state', 'expanded')
    });

    it('should have tickets link', () => {
      sidebar.getTicketsButton().should("be.visible");
    });

    it('should have labels link', () => {
      sidebar.getLabelsButton().should("be.visible");
    });

    it('should have users link', () => {
      sidebar.getUsersButton().should("be.visible");
    });

    it('should have theme toggle', () => {
      sidebar.getThemeToggle().should('be.visible');
    });

    it('should change theme', () => {
      const lightModeRgb = 'rgb(255, 255, 255)'
      const darkModeRgb = 'rgb(10, 10, 10)'

      cy.get('body')
        .invoke('css', 'background-color')
        .then((initialBg) => {
          sidebar.getThemeToggle().click()

          cy.get('body')
            .invoke('css', 'background-color')
            .should((newBg) => {
              if (initialBg.toString() === lightModeRgb) expect(newBg).to.equal(darkModeRgb);
              else expect(newBg).to.equal(lightModeRgb);
            });
        });
    });

    it('should have settings link', () => {
      sidebar.getSettingsButton().should("be.visible");
    });

    it('should have logout button', () => {
      sidebar.getLogout().should("be.visible");
    });

    it('should logout when clicking logout', () => {
      sidebar.getLogout().click()
      cy.url().should('contain', '/login');
      sidebar.getSidebar().should('not.exist')
      getFooter().should('be.visible')
    });
  })

  context('logged in as user', () => {
    beforeEach(() => {
      cy.login(users.fsles1.mail, users.fsles1.password)
      cy.visit('/tickets')
    })

    it('should exist when logged in', () => {
      sidebar.getSidebar().should('be.visible')
    });

    it('should have tickets link', () => {
      sidebar.getTicketsButton().should("be.visible");
    });

    it('should have labels link', () => {
      sidebar.getLabelsButton().should("be.visible");
    });

    it('should not have users link', () => {
      sidebar.getUsersButton().should("not.exist");
    });
  })
})
