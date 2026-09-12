import users from "#/fixtures/users.json"
import * as accountPage from "#/pages/accountsettings.po"
import {UserRole} from "@/lib/graph/generated/graphql";

const roles: UserRole[] = [UserRole.Admin, UserRole.User]

roles.forEach((role) => {
  const user = role === UserRole.Admin ? users.cypress : users.fsles1;

  context(`As ${role}`, () => {

    beforeEach(() => {
      cy.login(user.mail, user.password);
      cy.visit("/account");
    });

    describe('Profile Settings Page', () => {
      context('User Data and Form Format', () => {
        it('should load existing user data into the form fields', () => {
          accountPage.getFirstnameInput().should('have.value', user.firstname);
          accountPage.getLastnameInput().should('have.value', user.lastname);
          accountPage.getMailInput().should('have.value', user.mail);
        });

        it('should load settings page with all fields', () => {
          accountPage.getFirstnameInput().should('exist');
          accountPage.getLastnameInput().should('exist')
          accountPage.getMailInput().should('exist')
          accountPage.getProfileSaveButton().should('be.visible');
          accountPage.getCurrentPasswordInput().should('exist')
          accountPage.getNewPasswordInput().should('exist')
          accountPage.getConfirmPasswordInput().should('exist')
          accountPage.getPasswordSaveButton().should('be.visible');
        });

        it('profile form - disables save button when form is untouched', () => {
          accountPage.getProfileSaveButton().should('be.disabled');
        });

        it('password form - disables save button when form is untouched', () => {
          accountPage.getPasswordSaveButton().should('be.disabled');
        });
      });

      context('Account Data - Empty Fields', () => {
        const emptyFieldError: string = "Bitte angeben"

        it('shows validation errors for empty field firstname', () => {
          accountPage.getFirstnameInput().should('have.value', user.firstname);
          accountPage.getFirstnameInput().clear()
          accountPage.getProfileSaveButton().click();

          accountPage.getFirstnameMessage().should('contain', emptyFieldError);
        });

        it('shows validation errors for empty field lastname', () => {
          accountPage.getLastnameInput().should('have.value', user.lastname);
          accountPage.getLastnameInput().clear()
          accountPage.getProfileSaveButton().click();
          accountPage.getLastnameMessage()
            .scrollIntoView()
            .should('contain', emptyFieldError);
        });

        it('shows validation errors for empty field email', () => {
          accountPage.getMailInput().should('have.value', user.mail);
          accountPage.getMailInput().clear()
          accountPage.getProfileSaveButton().click();
          accountPage.getMailMessage()
            .scrollIntoView()
            .should('contain', "Bitte gib ein gültiges E-Mail Format an");
        });
      })

      context('Account Data - Faulty Inputs', () => {
        const longText = "a".repeat(51);
        const longError = "Bitte gib maximal 50 Zeichen an"

        it('shows validation errors for field email upon non-unique mail', () => {
          accountPage.getMailInput().clear()
          accountPage.getMailInput().type(users.chef.mail)
          accountPage.getProfileSaveButton().click();

          accountPage.getMailMessage().should('contain', 'Diese E-Mail wird schon verwendet');
        });

        it('shows error for invalid email format', () => {
          accountPage.getMailInput().clear().type('this-is-not-an-email');
          accountPage.getProfileSaveButton().click();
          accountPage.getMailMessage().should('contain', 'Bitte gib ein gültiges E-Mail Format an');
        });

        it('shows error for too long firstname', () => {
          accountPage.getFirstnameInput().clear().type(longText);
          accountPage.getProfileSaveButton().click();
          accountPage.getFirstnameMessage().should('contain', longError);
        });

        it('shows error for too long lastname', () => {
          accountPage.getLastnameInput().clear().type(longText);
          accountPage.getProfileSaveButton().click();

          accountPage.getLastnameMessage().should('contain', longError);
        });
      })

      context('Account Data - Whitespaces', () => {
        it('whitespaces - firstname', () => {
          cy.intercept('POST', '/api', (req) => {
            if (req.body.operationName === 'updateUserSettings') {
              req.alias = "updateUserMutation";

              req.reply({
                statusCode: 200,
                body: {
                  data: {
                    updateUser: {
                      id: ''
                    }
                  }
                }
              });
            }
          });

          accountPage.getFirstnameInput().clear();
          accountPage.getFirstnameInput().type(' Name ');
          accountPage.getProfileSaveButton().click();

          cy.wait('@updateUserMutation')
              .its('request.body.variables.user.firstname')
              .should('eq', 'Name');
        });

        it('whitespaces - lastname', () => {
          cy.intercept('POST', '/api', (req) => {
            if (req.body.operationName === 'updateUserSettings') {
              req.alias = "updateUserMutation";

              req.reply({
                statusCode: 200,
                body: {
                  data: {
                    updateUser: {
                      id: ''
                    }
                  }
                }
              });
            }
          });

          accountPage.getLastnameInput().clear();
          accountPage.getLastnameInput().type(' Name ');
          accountPage.getProfileSaveButton().click();

          cy.wait('@updateUserMutation')
              .its('request.body.variables.user.lastname')
              .should('eq', 'Name');
        });
      })

      context('Password Form - Validation Errors', () => {
        it('shows error if old password is empty', () => {
          accountPage.getNewPasswordInput().type('StrongPass1!');
          accountPage.getConfirmPasswordInput().type('StrongPass1!');
          accountPage.getPasswordSaveButton().click();

          accountPage.getCurrentPasswordMessage().should('contain', 'Bitte angeben');
        });

        it('shows error if new password is less than 8 characters', () => {
          accountPage.getCurrentPasswordInput().type(user.password);
          accountPage.getNewPasswordInput().type('Ab1!');
          accountPage.getConfirmPasswordInput().type('Ab1!');
          accountPage.getPasswordSaveButton().click();

          accountPage.getNewPasswordMessage().should('contain', 'Bitte gib mindestens 8 Zeichen an');
        });

        it('shows error if new password has no uppercase letter', () => {
          accountPage.getCurrentPasswordInput().type(user.password);
          accountPage.getNewPasswordInput().type('strongpass1!');
          accountPage.getConfirmPasswordInput().type('strongpass1!');
          accountPage.getPasswordSaveButton().click();

          accountPage.getNewPasswordMessage().should('contain', 'Bitte gib mindestens einen Großbuchstaben an');
        });

        it('shows error if new password has no number', () => {
          accountPage.getCurrentPasswordInput().type(user.password);
          accountPage.getNewPasswordInput().type('StrongPass!');
          accountPage.getConfirmPasswordInput().type('StrongPass!');
          accountPage.getPasswordSaveButton().click();

          accountPage.getNewPasswordMessage().should('contain', 'Bitte gib mindestens eine Zahl an');
        });

        it('shows error if new password has no special character', () => {
          accountPage.getCurrentPasswordInput().type(user.password);
          accountPage.getNewPasswordInput().type('StrongPass1');
          accountPage.getConfirmPasswordInput().type('StrongPass1');
          accountPage.getPasswordSaveButton().click();

          accountPage.getNewPasswordMessage().should('contain', 'Bitte gib mindestens ein Sonderzeichen an');
        });

        it('shows error if confirm password does not match', () => {
          accountPage.getCurrentPasswordInput().type(user.password);
          accountPage.getNewPasswordInput().type('StrongPass1!');
          accountPage.getConfirmPasswordInput().type('WrongPass1!');
          accountPage.getPasswordSaveButton().click();
          accountPage.getConfirmPasswordMessage().should('contain', 'Passwörter stimmen nicht überein');
        });

        it('shows error when new password is same as old password', () => {
          accountPage.getCurrentPasswordInput().type(user.password);
          accountPage.getNewPasswordInput().type(user.password);
          accountPage.getConfirmPasswordInput().type(user.password);
          accountPage.getPasswordSaveButton().click();
          accountPage.getNewPasswordMessage().should('contain', 'Neues Passwort darf nicht dem alten entsprechen');
        });

        it('shows an error when the current password is incorrect', () => {
          const invalidPassword = 'WrongPassword123!';
          const validPassword = 'ValidPass1!'

          accountPage.getCurrentPasswordInput().type(invalidPassword);
          accountPage.getNewPasswordInput().type(validPassword);
          accountPage.getConfirmPasswordInput().type(validPassword);
          accountPage.getPasswordSaveButton().click();
          accountPage.getCurrentPasswordMessage().should('contain', 'Passwort inkorrekt')
        });
      });

      // context('Password Form - Correct Input', () => {
      //   it('accepts valid password and enables save button', () => {
      //     accountPage.getCurrentPasswordInput().type('StrongPass1!');
      //     accountPage.getNewPasswordInput().type('StrongPass123!');
      //     accountPage.getConfirmPasswordInput().type('StrongPass123!');
      //     accountPage.getPasswordSaveButton().should('not.be.disabled');
      //   });
      // })
      //
      // context('Account Data Form - Correct Input', () => {
      //   it('accepts new firstname and enables save button', () => {
      //     accountPage.getFirstnameInput().clear();
      //     accountPage.getFirstnameInput().type('Alfred');
      //     accountPage.getProfileSaveButton().click();
      //     cy.contains("Dein Account wurde erfolgreich aktualisiert").should('be.visible');
      //     accountPage.getFirstnameInput().should('have.value', 'Alfred');
      //     cy.reload();
      //     accountPage.getFirstnameInput().should('have.value', 'Alfred');
      //   });
      //   it('accepts new lastname and enables save button', () => {
      //     accountPage.getLastnameInput().clear();
      //     accountPage.getLastnameInput().type('Barnes');
      //     accountPage.getProfileSaveButton().click();
      //     cy.contains("Dein Account wurde erfolgreich aktualisiert").should('be.visible');
      //     accountPage.getLastnameInput().should('have.value', 'Barnes');
      //     cy.reload();
      //     accountPage.getLastnameInput().should('have.value', 'Barnes');
      //   });
      //   //FIXME: #298 (for user)
      //   it('accepts new mail and enables save button', () => {
      //     accountPage.getMailInput().clear();
      //     accountPage.getMailInput().type('alfred.barnes@kummer.kasten');
      //     accountPage.getProfileSaveButton().click();
      //     cy.contains("Dein Account wurde erfolgreich aktualisiert").should('be.visible');
      //     loginPage.login('alfred.barnes@kummer.kasten', currentCorrectPassword);
      //     sidebar.getSettingsButton().click();
      //     currentCorrectMail = 'alfred.barnes@kummer.kasten';
      //   });
      // })
    })
  })
});
