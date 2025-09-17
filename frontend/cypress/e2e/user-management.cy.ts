import users from "../fixtures/users.json"
import * as page from "../pages/users/user-management.po"
import * as creationDialog from "../pages/users/user-dialog.po"

describe('User Management Page Tests', () => {
  beforeEach(() => {
    cy.login(users.admin.mail, users.admin.password)
    cy.visit("/users")
  })

  it('shows a searchbar', () => {
    page.getSearchbar().should('be.visible')
  });

  it('shows a create user button', () => {
    page.getCreateUserButton().should('be.visible')
  });

  context('Create User Dialog', () => {
    beforeEach(() => {
      page.getCreateUserButton().click()
    })
    it('opens dialog on click', () => {
      creationDialog.getDialog().should('be.visible')
    });

    it('closes on clicking cancel', () => {
      creationDialog.cancel()
      creationDialog.getDialog().should('not.exist')
    });

    it('disables no buttons', () => {
      creationDialog.getCancelButton().should('not.be.disabled')
      creationDialog.getSubmitButton().should('not.be.disabled')
    });

    context('Create User Form', () => {
      it('shows the complete form', () => {
        creationDialog.getFirstNameInput().should('be.visible')
        creationDialog.getLastNameInput().should('be.visible')
        creationDialog.getEmailInput().should('be.visible')
        creationDialog.getPasswordInput().should('be.visible')
        creationDialog.getConfirmPasswordInput().should('be.visible')
        creationDialog.getCancelButton().should('be.visible')
        creationDialog.getSubmitButton().should('be.visible')
      })

      it('shows no error on empty form - no submit', () => {
        creationDialog.getFirstnameInputMessage().should('not.exist')
        creationDialog.getLastnameInputMessage().should('not.exist')
        creationDialog.getEmailInputMessage().should('not.exist')
        creationDialog.getPasswordInputMessage().should('not.exist')
        creationDialog.getConfirmPasswordInputMessage().should('not.exist')
      });

      it('shows error and disables submit on invalid submit - empty form', () => {
        creationDialog.submit()

        creationDialog.getFirstnameInputMessage().should('be.visible').and('have.length.above', 0)
        creationDialog.getLastnameInputMessage().should('be.visible').and('have.length.above', 0)
        creationDialog.getEmailInputMessage().should('be.visible').and('have.length.above', 0)
        creationDialog.getPasswordInputMessage().should('be.visible').and('have.length.above', 0)

        creationDialog.getSubmitButton().should('be.disabled')
      });

      it('shows error and disables submit on invalid submit - short firstname', () => {
        creationDialog.fillOutForm({firstname: "a"})
        creationDialog.submit()

        creationDialog.getFirstnameInputMessage().should('be.visible').and('have.length.above', 0)
      });

      it('shows error and disables submit on invalid submit - short lastname', () => {
        creationDialog.fillOutForm({lastname: "a"})
        creationDialog.submit()

        creationDialog.getLastnameInputMessage().should('be.visible').and('have.length.above', 0)
      });

      it('shows error and disables submit on invalid submit - invalid mail format', () => {
        creationDialog.fillOutForm({mail: "a"})
        creationDialog.submit()

        creationDialog.getEmailInputMessage().should('be.visible').and('have.length.above', 0)
      });

      it('shows error and disables submit on invalid submit - mail taken', () => {
        creationDialog.fillOutForm({
          firstname: users.temp.firstname,
          lastname: users.temp.lastname,
          mail: users.fsles1.mail,
          password: users.temp.password,
          confirmPassword: users.temp.password,
        })
        creationDialog.submit()

        creationDialog.getEmailInputMessage().should('be.visible').and('have.length.above', 0)
      });

      it('shows error and disables submit on invalid submit - password short', () => {
        creationDialog.fillOutForm({password: "a"})
        creationDialog.submit()

        creationDialog.getPasswordInputMessage().should('be.visible').and('have.length.above', 0)
      });

      it('shows error and disables submit on invalid submit - password no number', () => {
        creationDialog.fillOutForm({password: "aaaaaaaaaAaaaaaaaa!"})
        creationDialog.submit()

        creationDialog.getPasswordInputMessage().should('be.visible').and('have.length.above', 0)
      });

      it('shows error and disables submit on invalid submit - password no capital letter', () => {
        creationDialog.fillOutForm({password: "aaaaaaaaa2aaaaaaaa!"})
        creationDialog.submit()

        creationDialog.getPasswordInputMessage().should('be.visible').and('have.length.above', 0)
      });

      it('shows error and disables submit on invalid submit - password no symbol', () => {
        creationDialog.fillOutForm({password: "aaaaaaaaa2aaaaaaaaA"})
        creationDialog.submit()

        creationDialog.getPasswordInputMessage().should('be.visible').and('have.length.above', 0)
      });

      it('shows error and disables submit on invalid submit - password no lower letter', () => {
        creationDialog.fillOutForm({password: "AAAAAAAAAAA!123AAAAAA"})
        creationDialog.submit()

        creationDialog.getPasswordInputMessage().should('be.visible').and('have.length.above', 0)
      });

      it('shows error and disables submit on invalid submit - confirm password not same', () => {
        creationDialog.fillOutForm({password: "ThisIsForTesting123!", confirmPassword: "ThisIsForTesting!123"})
        creationDialog.submit()

        creationDialog.getConfirmPasswordInputMessage().should('be.visible').and('have.length.above', 0)
      });

      it('creates no user on cancel', () => {
        creationDialog.fillOutForm({...users.temp, confirmPassword: users.temp.password})
        creationDialog.cancel()

        creationDialog.getDialog().should('not.exist')
        page.getUserRows().contains('td', users.temp.mail).should('not.exist')
      });

      it('closes and creates user on valid submision', () => {
        creationDialog.fillOutForm({...users.temp, confirmPassword: users.temp.password})
        creationDialog.submit()

        creationDialog.getDialog().should('not.exist')
        page.getUserRows().contains('td', users.temp.mail).should('be.visible')

        cy.getUserIdByMail(users.temp.mail).should('have.length.above', 0)
      });

      after(() => {
        cy.deleteUser(users.temp.mail)
      })
    })
  })

  context('User Table - Visual Tests', () => {
    it('exists', () => {
      page.getUserTable().should('be.visible')
    });

    it('has user rows', () => {
      const AMOUNT_USERS_IN_SEEDED_DB = 7
      page.getUserRows().should('have.length', AMOUNT_USERS_IN_SEEDED_DB)
    });

    it('shows search results if they exist', () => {
      const query = "kummer"
      page.search(query)
      // There is only one user with last name containing kummer in our seeds
      page.getUserRows().should('have.length', 1)
      page.getUserRows().each(($el) => {
        cy.wrap($el).find('td').should('contain.text', query)
      })
    });

    it('shows a message if no entries could be found', () => {
      const query = "invalid query"
      page.search(query)
      page.getUserRows().should('have.length', 0)
      page.getNoResultsMessage().should('be.visible')
    });

    it('does not allow editing on self', () => {
      page.getActionsOfUsers(users.admin.mail).should('not.exist')
    });
  })

  context('User Table - Sorting', () => {
    it('sorts lastnames ascending by default', () => {
      let names: string[] = []
      page.getUserRows().should("have.length.at.least", 2)
      page.getLastnameCells()
        .each(($el) => names.push($el.text()))
        .then(() => {
          const sorted = [...names].sort()
          expect(names).to.deep.eq(sorted)
        })
    })

    it('sorts lastnames descending', () => {
      let names: string[] = []
      page.getUserRows().should("have.length.at.least", 2)
      page.getLastnameHeader().click()
      page.getLastnameCells()
        .each(($el) => names.push($el.text()))
        .then(() => {
          const sorted = [...names].sort().reverse()
          expect(names).to.deep.eq(sorted)
        })
    })

    it('sorts firstnames ascending', () => {
      let names: string[] = []
      page.getUserRows().should("have.length.at.least", 2)
      page.getFirstnameHeader().click()
      page.getFirstnameCells()
        .each(($el) => names.push($el.text()))
        .then(() => {
          const sorted = [...names].sort()
          expect(names).to.deep.eq(sorted)
        })
    })

    it('sorts firstnames descending', () => {
      let names: string[] = []
      page.getUserRows().should("have.length.at.least", 2)
      page.getFirstnameHeader().click()
      page.getFirstnameHeader().click()
      page.getFirstnameCells()
        .each(($el) => names.push($el.text()))
        .then(() => {
          const sorted = [...names].sort().reverse()
          expect(names).to.deep.eq(sorted)
        })
    })

    it('sorts mails ascending', () => {
      let names: string[] = []
      page.getUserRows().should("have.length.at.least", 2)
      page.getMailHeader().click()
      page.getMailCells()
        .each(($el) => names.push($el.text()))
        .then(() => {
          const sorted = [...names].sort()
          expect(names).to.deep.eq(sorted)
        })
    })

    it('sorts mails descending', () => {
      let names: string[] = []
      page.getUserRows().should("have.length.at.least", 2)
      page.getMailHeader().click()
      page.getMailHeader().click()
      page.getMailCells()
        .each(($el) => names.push($el.text()))
        .then(() => {
          const sorted = [...names].sort().reverse()
          expect(names).to.deep.eq(sorted)
        })
    })
  })
})