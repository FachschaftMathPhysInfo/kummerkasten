import users from "../fixtures/users.json"
import * as accountPage from "../pages/accountsettings.po"
import * as loginPage from "../pages/login.po"
import * as sidebar from "../pages/sidebar.po"

describe('Profile Settings Page', () => {
    let currentCorrectPassword = users.cypress.password;
    let currentCorrectMail = users.cypress.mail;
    beforeEach(() => {
        cy.login(currentCorrectMail, currentCorrectPassword)
        cy.visit("/account")
    })

    context('User Data and Form Format', () => {
        it('should load existing user data into the form fields', () => {
            accountPage.getFirstnameInput().should('have.value', users.cypress.firstname);
            accountPage.getLastnameInput().should('have.value', users.cypress.lastname);
            accountPage.getMailInput().should('have.value', users.cypress.mail);
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

    context('Validation Errors - Empty Fields', () => {
        it('shows validation errors for empty field firstname', () => {
            accountPage.getFirstnameInput().should('have.value', users.cypress.firstname);
            accountPage.getFirstnameInput().clear()
            accountPage.getProfileSaveButton().click();
            accountPage.getFirstnameMessage()
                .scrollIntoView()
                .should('contain', 'Vorname ist erforderlich');
        });
        it('shows validation errors for empty field lastname', () => {
            accountPage.getLastnameInput().should('have.value', users.cypress.lastname);
            accountPage.getLastnameInput().clear()
            accountPage.getProfileSaveButton().click();
            accountPage.getLastnameMessage()
                .scrollIntoView()
                .should('contain', 'Nachname ist erforderlich');
        });
        it('shows validation errors for empty field email', () => {
            accountPage.getMailInput().should('have.value', users.cypress.mail);
            accountPage.getMailInput().clear()
            accountPage.getProfileSaveButton().click();
            accountPage.getMailMessage()
                .scrollIntoView()
                .should('contain', 'Ungültige E-Mail-Adresse');
        });
    })

    context('Validation Errors - Wrong Inputs', () => {
        it('shows validation errors for field email upon non-unique mail', () => {
            accountPage.getMailInput().should('have.value', users.cypress.mail);
            accountPage.getMailInput().clear()
            accountPage.getMailInput().type(users.fsles1.mail)
            accountPage.getProfileSaveButton().click();
            accountPage.getMailMessage()
                .scrollIntoView()
                .should('contain', 'Diese E-Mail-Adresse wird bereits verwendet');
        });
        it('shows error for invalid email format', () => {
            accountPage.getMailInput().clear().type('this-is-not-an-email');
            accountPage.getProfileSaveButton().click();
            accountPage.getMailMessage().should('contain', 'Ungültige E-Mail-Adresse');
        });
        it('shows error for too long firstname', () => {
            accountPage.getFirstnameInput().clear().type('This is more than 50 Characters, because we need to test this out.');
            accountPage.getProfileSaveButton().click();
            accountPage.getFirstnameMessage().should('contain', 'Maximale Länge beträgt 50 Charaktere');
        });
        it('shows error for too long lastname', () => {
            accountPage.getLastnameInput().clear().type('This is more than 50 Characters, because we need to test this out.');
            accountPage.getProfileSaveButton().click();
            accountPage.getLastnameMessage().should('contain', 'Maximale Länge beträgt 50 Charaktere');
        });
    })

    context('Account Data - Leading Whitespaces', () => {
        it('removes leading whitespaces - firstname', () => {
            accountPage.getFirstnameInput().should('have.value', users.cypress.firstname);
            accountPage.getFirstnameInput().clear()
            accountPage.getFirstnameInput().type(' ' + users.cypress.firstname)
            accountPage.getProfileSaveButton().click();
            cy.reload();
            accountPage.getFirstnameInput().should('have.value', "Admin");
        });

        it('removes leading whitespaces - lastname', () => {
            accountPage.getLastnameInput().should('have.value', users.cypress.lastname);
            accountPage.getLastnameInput().clear()
            accountPage.getLastnameInput().type(' ' + users.cypress.lastname)
            accountPage.getProfileSaveButton().click();
            cy.reload();
            accountPage.getLastnameInput().should('have.value', "Cypress");
        });

        //leading whitespaces on mail do not need to be tested because it counts as invalid mail format
    })

    context('Account Data - Trailing Whitespaces', () => {
        it('removes trailing whitespaces - firstname', () => {
            accountPage.getFirstnameInput().should('have.value', users.cypress.firstname);
            accountPage.getFirstnameInput().clear()
            accountPage.getFirstnameInput().type(users.cypress.firstname + ' ')
            accountPage.getProfileSaveButton().click();
            cy.reload();
            accountPage.getFirstnameInput().should('have.value', "Admin");
        });

        it('removes trailing whitespaces - lastname', () => {
            accountPage.getLastnameInput().should('have.value', users.cypress.lastname);
            accountPage.getLastnameInput().clear()
            accountPage.getLastnameInput().type(users.cypress.lastname + ' ')
            accountPage.getProfileSaveButton().click();
            cy.reload();
            accountPage.getLastnameInput().should('have.value', "Cypress");
        });
        //trailing whitespaces on mail do not need to be tested because it counts as invalid mail format
    })

    context('Breaking Things - Account Data', () => {
        it('disables save button during form submission', () => {
            accountPage.getFirstnameInput().clear().type('Test');
            accountPage.getProfileSaveButton().click();
            accountPage.getProfileSaveButton().should('be.disabled');
        });
    })

    context('Password Form - Input Errors', () => {
        it('shows error if old password is empty', () => {
            accountPage.getNewPasswordInput().type('StrongPass1!');
            accountPage.getConfirmPasswordInput().type('StrongPass1!');
            accountPage.getPasswordSaveButton().click();

            accountPage.getCurrentPasswordMessage().should('contain', 'Bitte gib dein aktuelles Passwort ein.');
        });

        it('shows error if new password is less than 8 characters', () => {
            accountPage.getCurrentPasswordInput().type(users.cypress.password);
            accountPage.getNewPasswordInput().type('Ab1!');
            accountPage.getConfirmPasswordInput().type('Ab1!');
            accountPage.getPasswordSaveButton().click();

            accountPage.getNewPasswordMessage().should('contain', 'Mindestens 8 Zeichen.');
        });

        it('shows error if new password has no uppercase letter', () => {
            accountPage.getCurrentPasswordInput().type(users.cypress.password);
            accountPage.getNewPasswordInput().type('strongpass1!');
            accountPage.getConfirmPasswordInput().type('strongpass1!');
            accountPage.getPasswordSaveButton().click();

            accountPage.getNewPasswordMessage().should('contain', 'Mindestens ein Großbuchstabe.');
        });

        it('shows error if new password has no number', () => {
            accountPage.getCurrentPasswordInput().type(users.cypress.password);
            accountPage.getNewPasswordInput().type('StrongPass!');
            accountPage.getConfirmPasswordInput().type('StrongPass!');
            accountPage.getPasswordSaveButton().click();

            accountPage.getNewPasswordMessage().should('contain', 'Mindestens eine Zahl.');
        });

        it('shows error if new password has no special character', () => {
            accountPage.getCurrentPasswordInput().type(users.cypress.password);
            accountPage.getNewPasswordInput().type('StrongPass1');
            accountPage.getConfirmPasswordInput().type('StrongPass1');
            accountPage.getPasswordSaveButton().click();

            accountPage.getNewPasswordMessage().should('contain', 'Mindestens ein Sonderzeichen.');
        });

        it('shows error if confirm password does not match', () => {
            accountPage.getCurrentPasswordInput().type(users.cypress.password);
            accountPage.getNewPasswordInput().type('StrongPass1!');
            accountPage.getConfirmPasswordInput().type('WrongPass1!');
            accountPage.getPasswordSaveButton().click();
            accountPage.getConfirmPasswordMessage().should('contain', 'Passwörter stimmen nicht überein.');
        });

        it('shows error when new password is same as old password', () => {
            const originalPassword = users.cypress.password;
            const newPassword = 'StrongPass1!';
            accountPage.getCurrentPasswordInput().type(originalPassword);
            accountPage.getNewPasswordInput().type(newPassword);
            accountPage.getConfirmPasswordInput().type(newPassword);
            accountPage.getPasswordSaveButton().click();
            cy.contains("Passwort aktualisiert", {timeout: 10000}).should('be.visible');
            loginPage.login(users.cypress.mail, newPassword);
            sidebar.getSettingsButton().click();
            accountPage.getCurrentPasswordInput().type(newPassword);
            accountPage.getNewPasswordInput().type(newPassword);
            accountPage.getConfirmPasswordInput().type(newPassword);
            accountPage.getPasswordSaveButton().click();
            accountPage.getNewPasswordMessage().should('contain', 'Neues Passwort darf nicht dem alten entsprechen.');
            currentCorrectPassword = newPassword;
        });
    });


    context('Password Form - Wrong Passwords', () => {
        it('shows an error when the current password is incorrect', () => {
            const invalidPassword = 'WrongPassword123!';
            accountPage.getCurrentPasswordInput().type(invalidPassword);
            accountPage.getNewPasswordInput().type('ValidNewPass1!');
            accountPage.getConfirmPasswordInput().type('ValidNewPass1!');
            accountPage.getPasswordSaveButton().click();
            accountPage.getCurrentPasswordMessage().should('contain', 'Falsches aktuelles Passwort.')
        });

        it('shows an error when the new and repeated passwords do not match', () => {
            accountPage.getCurrentPasswordInput().type(users.admin.password);
            accountPage.getNewPasswordInput().type('ValidNewPass1!');
            accountPage.getConfirmPasswordInput().type('DifferentPass1!');
            accountPage.getPasswordSaveButton().click();
            accountPage.getConfirmPasswordMessage().should('contain', 'Passwörter stimmen nicht überein.');
        });
    })

    context('Password Form - Correct Input', () => {
        it('accepts valid password and enables save button', () => {
            accountPage.getCurrentPasswordInput().type('StrongPass1!');
            accountPage.getNewPasswordInput().type('StrongPass123!');
            accountPage.getConfirmPasswordInput().type('StrongPass123!');
            accountPage.getPasswordSaveButton().should('not.be.disabled');
        });
    })

    context('Account Data Form - Correct Input', () => {
        it('accepts new firstname and enables save button', () => {
            accountPage.getFirstnameInput().clear();
            accountPage.getFirstnameInput().type('Alfred');
            accountPage.getProfileSaveButton().click();
            cy.contains("Dein Account wurde erfolgreich aktualisiert").should('be.visible');
            accountPage.getFirstnameInput().should('have.value', 'Alfred');
            cy.reload();
            accountPage.getFirstnameInput().should('have.value', 'Alfred');
        });
        it('accepts new lastname and enables save button', () => {
            accountPage.getLastnameInput().clear();
            accountPage.getLastnameInput().type('Barnes');
            accountPage.getProfileSaveButton().click();
            cy.contains("Dein Account wurde erfolgreich aktualisiert").should('be.visible');
            accountPage.getLastnameInput().should('have.value', 'Barnes');
            cy.reload();
            accountPage.getLastnameInput().should('have.value', 'Barnes');
        });
        it('accepts new mail and enables save button', () => {
            accountPage.getMailInput().clear();
            accountPage.getMailInput().type('alfred.barnes@kummer.kasten');
            accountPage.getProfileSaveButton().click();
            cy.contains("Dein Account wurde erfolgreich aktualisiert").should('be.visible');
            loginPage.login('alfred.barnes@kummer.kasten', currentCorrectPassword);
            sidebar.getSettingsButton().click();
            currentCorrectMail = 'alfred.barnes@kummer.kasten';
        });
    })

    after(() => {
        cy.fixture("users").then((u) => {
            cy.visit("/account");
            accountPage.getFirstnameInput().clear();
            accountPage.getLastnameInput().clear();
            accountPage.getMailInput().clear();
            cy.getUserIdByMail(currentCorrectMail).then((uuid) => {
                cy.updateUserProfile(uuid, {
                    firstname: u.cypress.firstname,
                    lastname: u.cypress.lastname,
                    mail: u.cypress.mail,
                });
                cy.updateUserPassword(currentCorrectPassword, u.cypress.password);
            });
            cy.reload();
        });
    })
});
