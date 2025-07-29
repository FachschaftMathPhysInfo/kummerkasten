import users from "../fixtures/users.json"
import * as accountPage from "../pages/accountsettings.po"
import * as loginPage from "../pages/login.po"
import * as sidebar from "../pages/sidebar.po"

describe('Profile Settings Page', () => {
    let currentCorrectPassword: string;
    currentCorrectPassword = users.cypress.password;
    let currentCorrectMail: string;
    currentCorrectMail = users.cypress.mail;
    beforeEach(() => {
        cy.login(currentCorrectMail, currentCorrectPassword)
        cy.visit("/account")
    })

    describe('User Data and Form Format', () => {
        it('should load existing user data into the form fields', () => {
            cy.get('[data-cy="account-firstname-input"]').should('have.value', users.cypress.firstname);
            cy.get('[data-cy="account-lastname-input"]').should('have.value', users.cypress.lastname);
            cy.get('[data-cy="account-mail-input"]').should('have.value', users.cypress.mail);
        });
        it('should load settings page with all fields', () => {
            accountPage.getFirstnameInput().should('exist');
            accountPage.getLastnameInput().should('exist')
            accountPage.getMailInput().should('exist')
            cy.get('[data-cy="input-profile-save"]').should('be.visible');
            accountPage.getCurrentPasswordInput().should('exist')
            accountPage.getNewPasswordInput().should('exist')
            accountPage.getRepeatedPasswordInput().should('exist')
            accountPage.getProfileSaveButton().should('be.visible');
        });
        it('profile form - disables save button when form is untouched', () => {
            accountPage.getProfileSaveButton().should('be.disabled');
        });
        it('password form - disables save button when form is untouched', () => {
            accountPage.getPasswordSaveButton().should('be.disabled');
        });

    });

    describe('Validation Errors - Empty Fields', () => {
        it('shows validation errors for empty field firstname', () => {
            cy.get('[data-cy="account-firstname-input"]').should('have.value', users.cypress.firstname);
            accountPage.getFirstnameInput().clear()
            cy.get('[data-cy="input-profile-save"]').click();
            accountPage.getFirstnameMessage()
                .scrollIntoView()
                .should('contain', 'Vorname ist erforderlich');
        });
        it('shows validation errors for empty field lastname', () => {
            cy.get('[data-cy="account-lastname-input"]').should('have.value', users.cypress.lastname);
            accountPage.getLastnameInput().clear()
            cy.get('[data-cy="input-profile-save"]').click();
            accountPage.getLastnameMessage()
                .scrollIntoView()
                .should('contain', 'Nachname ist erforderlich');
        });
        it('shows validation errors for empty field email', () => {
            cy.get('[data-cy="account-mail-input"]').should('have.value', users.cypress.mail);
            accountPage.getMailInput().clear()
            cy.get('[data-cy="input-profile-save"]').click();
            accountPage.getMailMessage()
                .scrollIntoView()
                .should('contain', 'Ungültige E-Mail-Adresse');
        });
    })

    describe('Validation Errors - Wrong Inputs', () => {
        it('shows validation errors for field email upon non-unique mail', () => {
            cy.get('[data-cy="account-mail-input"]').should('have.value', users.cypress.mail);
            accountPage.getMailInput().clear()
            accountPage.getMailInput().type(users.fsles1.mail)
            cy.get('[data-cy="input-profile-save"]').click();
            accountPage.getMailMessage()
                .scrollIntoView()
                .should('contain', 'Diese E-Mail-Adresse wird bereits verwendet');
        });
        it('shows error for invalid email format', () => {
            accountPage.getMailInput().clear().type('this-is-not-an-email');
            accountPage.getProfileSaveButton().click();
            accountPage.getMailMessage().should('contain', 'Ungültige E-Mail-Adresse');
        });
    })

    describe('Account Data - Leading Whitespaces', () => {
        it('removes leading whitespaces - firstname', () => {
            accountPage.getFirstnameInput().should('have.value', users.cypress.firstname);
            accountPage.getFirstnameInput().clear()
            accountPage.getFirstnameInput().type(' ' + users.cypress.firstname)
            cy.get('[data-cy="input-profile-save"]').click();
            cy.reload();
            accountPage.getFirstnameInput().should('have.value', "Admin");
        });

        it('removes leading whitespaces - lastname', () => {
            accountPage.getLastnameInput().should('have.value', users.cypress.lastname);
            accountPage.getLastnameInput().clear()
            accountPage.getLastnameInput().type(' ' + users.cypress.lastname)
            cy.get('[data-cy="input-profile-save"]').click();
            cy.reload();
            accountPage.getLastnameInput().should('have.value', "Cypress");
        });

        //leading whitespaces on mail do not need to be tested because it counts as invalid mail format
    })

    describe('Account Data - Trailing Whitespaces', () => {
        it('removes trailing whitespaces - firstname', () => {
            accountPage.getFirstnameInput().should('have.value', users.cypress.firstname);
            accountPage.getFirstnameInput().clear()
            accountPage.getFirstnameInput().type(users.cypress.firstname + ' ')
            cy.get('[data-cy="input-profile-save"]').click();
            cy.reload();
            accountPage.getFirstnameInput().should('have.value', "Admin");
        });

        it('removes trailing whitespaces - lastname', () => {
            accountPage.getLastnameInput().should('have.value', users.cypress.lastname);
            accountPage.getLastnameInput().clear()
            accountPage.getLastnameInput().type(users.cypress.lastname + ' ')
            cy.get('[data-cy="input-profile-save"]').click();
            cy.reload();
            accountPage.getLastnameInput().should('have.value', "Cypress");
        });
        //trailing whitespaces on mail do not need to be tested because it counts as invalid mail format
    })

    describe('Breaking Things - Account Data', () => {
        it('disables save button during form submission', () => {
            accountPage.getFirstnameInput().clear().type('Test');
            accountPage.getProfileSaveButton().click();
            accountPage.getProfileSaveButton().should('be.disabled');
        });
    })

    describe('Password Form - Input Errors', () => {
        it('shows error if old password is empty', () => {
            accountPage.getNewPasswordInput().type('StrongPass1!');
            accountPage.getRepeatedPasswordInput().type('StrongPass1!');
            accountPage.getPasswordSaveButton().click();

            accountPage.getCurrentPasswordMessage().should('contain', 'Bitte gib dein aktuelles Passwort ein.');
        });

        it('shows error if new password is less than 8 characters', () => {
            accountPage.getCurrentPasswordInput().type(users.cypress.password);
            accountPage.getNewPasswordInput().type('Ab1!');
            accountPage.getRepeatedPasswordInput().type('Ab1!');
            accountPage.getPasswordSaveButton().click();

            accountPage.getNewPasswordMessage().should('contain', 'Mindestens 8 Zeichen.');
        });

        it('shows error if new password has no uppercase letter', () => {
            accountPage.getCurrentPasswordInput().type(users.cypress.password);
            accountPage.getNewPasswordInput().type('strongpass1!');
            accountPage.getRepeatedPasswordInput().type('strongpass1!');
            accountPage.getPasswordSaveButton().click();

            accountPage.getNewPasswordMessage().should('contain', 'Mindestens ein Großbuchstabe.');
        });

        it('shows error if new password has no number', () => {
            accountPage.getCurrentPasswordInput().type(users.cypress.password);
            accountPage.getNewPasswordInput().type('StrongPass!');
            accountPage.getRepeatedPasswordInput().type('StrongPass!');
            accountPage.getPasswordSaveButton().click();

            accountPage.getNewPasswordMessage().should('contain', 'Mindestens eine Zahl.');
        });

        it('shows error if new password has no special character', () => {
            accountPage.getCurrentPasswordInput().type(users.cypress.password);
            accountPage.getNewPasswordInput().type('StrongPass1');
            accountPage.getRepeatedPasswordInput().type('StrongPass1');
            accountPage.getPasswordSaveButton().click();

            accountPage.getNewPasswordMessage().should('contain', 'Mindestens ein Sonderzeichen.');
        });

        it('shows error if confirm password does not match', () => {
            accountPage.getCurrentPasswordInput().type(users.cypress.password);
            accountPage.getNewPasswordInput().type('StrongPass1!');
            accountPage.getRepeatedPasswordInput().type('WrongPass1!');
            accountPage.getPasswordSaveButton().click();
            accountPage.getRepeatedPasswordMessage().should('contain', 'Passwörter stimmen nicht überein.');
        });

        it('shows error when new password is same as old password', () => {
            const originalPassword = users.cypress.password;
            const newPassword = 'StrongPass1!';
            accountPage.getCurrentPasswordInput().type(originalPassword);
            accountPage.getNewPasswordInput().type(newPassword);
            accountPage.getRepeatedPasswordInput().type(newPassword);
            accountPage.getPasswordSaveButton().click();
            cy.contains("Passwort aktualisiert", {timeout: 10000}).should('exist');
            loginPage.login(users.cypress.mail, newPassword);
            sidebar.getSettingsButton().click();
            accountPage.getCurrentPasswordInput().type(newPassword);
            accountPage.getNewPasswordInput().type(newPassword);
            accountPage.getRepeatedPasswordInput().type(newPassword);
            accountPage.getPasswordSaveButton().click();
            accountPage.getNewPasswordMessage().should('contain', 'Neues Passwort darf nicht dem alten entsprechen.');
            currentCorrectPassword = newPassword;
        });
    });


    describe('Password Form - Wrong Passwords', () => {
        it('shows an error when the current password is incorrect', () => {
            const invalidPassword = 'WrongPassword123!';
            accountPage.getCurrentPasswordInput().type(invalidPassword);
            accountPage.getNewPasswordInput().type('ValidNewPass1!');
            accountPage.getRepeatedPasswordInput().type('ValidNewPass1!');
            accountPage.getPasswordSaveButton().click();
            accountPage.getCurrentPasswordMessage().should('contain', 'Falsches aktuelles Passwort.')
        });

        it('shows an error when the new and repeated passwords do not match', () => {
            accountPage.getCurrentPasswordInput().type(users.admin.password);
            accountPage.getNewPasswordInput().type('ValidNewPass1!');
            accountPage.getRepeatedPasswordInput().type('DifferentPass1!');
            accountPage.getPasswordSaveButton().click();
            accountPage.getRepeatedPasswordMessage().should('contain', 'Passwörter stimmen nicht überein.');
        });
    })

    describe('Password Form - Correct Input', () => {
        it('accepts valid password and enables save button', () => {
            accountPage.getCurrentPasswordInput().type('StrongPass1!');
            accountPage.getNewPasswordInput().type('StrongPass123!');
            accountPage.getRepeatedPasswordInput().type('StrongPass123!');
            accountPage.getPasswordSaveButton().should('not.be.disabled');
        });
    })

    describe('Account Data Form - Correct Input', () => {
        it('accepts new firstname and enables save button', () => {
            accountPage.getFirstnameInput().clear();
            accountPage.getFirstnameInput().type('Alfred');
            accountPage.getProfileSaveButton().click();
            cy.contains("Dein Account wurde erfolgreich aktualisiert").should('exist');
            accountPage.getFirstnameInput().should('have.value', 'Alfred');
            cy.reload();
            accountPage.getFirstnameInput().should('have.value', 'Alfred');
        });
        it('accepts new lastname and enables save button', () => {
            accountPage.getLastnameInput().clear();
            accountPage.getLastnameInput().type('Barnes');
            accountPage.getProfileSaveButton().click();
            cy.contains("Dein Account wurde erfolgreich aktualisiert").should('exist');
            accountPage.getLastnameInput().should('have.value', 'Barnes');
            cy.reload();
            accountPage.getLastnameInput().should('have.value', 'Barnes');
        });
        it('accepts new mail and enables save button', () => {
            accountPage.getMailInput().clear();
            accountPage.getMailInput().type('alfred.barnes@kummer.kasten');
            accountPage.getProfileSaveButton().click();
            cy.contains("Dein Account wurde erfolgreich aktualisiert").should('exist');
            loginPage.login('alfred.barnes@kummer.kasten', currentCorrectPassword);
            sidebar.getSettingsButton().click();
            currentCorrectMail = 'alfred.barnes@kummer.kasten';
        });
    })



    describe('Password visibility toggle', () => {

        it('toggle current password', () => {
            accountPage.getCurrentPasswordInput().type("Something")
            accountPage.getCurrentPasswordInput()
                .should('have.attr', 'type', 'password');
            accountPage.getCurrentPasswordInput()
                .parent()
                .find('button')
                .click();
            accountPage.getCurrentPasswordInput()
                .should('have.attr', 'type', 'text');
            accountPage.getCurrentPasswordInput()
                .parent()
                .find('button')
                .click();
            accountPage.getCurrentPasswordInput()
                .should('have.attr', 'type', 'password');
        });
        it('toggle new password', () => {
            accountPage.getNewPasswordInput().type("Something")
            accountPage.getNewPasswordInput()
                .should('have.attr', 'type', 'password');
            accountPage.getNewPasswordInput()
                .parent()
                .find('button')
                .click();
            accountPage.getNewPasswordInput()
                .should('have.attr', 'type', 'text');
            accountPage.getNewPasswordInput()
                .parent()
                .find('button')
                .click();
            accountPage.getNewPasswordInput()
                .should('have.attr', 'type', 'password');
        });
        it('toggle repeated password', () => {
            accountPage.getRepeatedPasswordInput().type("Something")
            accountPage.getRepeatedPasswordInput()
                .should('have.attr', 'type', 'password');
            accountPage.getRepeatedPasswordInput()
                .parent()
                .find('button')
                .click();
            accountPage.getRepeatedPasswordInput()
                .should('have.attr', 'type', 'text');
            accountPage.getRepeatedPasswordInput()
                .parent()
                .find('button')
                .click();
            accountPage.getRepeatedPasswordInput()
                .should('have.attr', 'type', 'password');
        });
    });


    after(() => {
        cy.visit("/account");
        accountPage.getFirstnameInput().clear();
        accountPage.getFirstnameInput().type(users.cypress.firstname);
        accountPage.getLastnameInput().clear();
        accountPage.getLastnameInput().type(users.cypress.lastname);
        accountPage.getMailInput().clear();
        accountPage.getMailInput().type(users.cypress.mail)
        accountPage.getProfileSaveButton().click();
        cy.contains("Dein Account wurde erfolgreich aktualisiert", {timeout: 10000}).should('exist');
        currentCorrectMail = users.cypress.mail;
        loginPage.login(currentCorrectMail, currentCorrectPassword);
        sidebar.getSettingsButton().click();
        accountPage.getCurrentPasswordInput().type(currentCorrectPassword);
        accountPage.getNewPasswordInput().type(users.cypress.password);
        accountPage.getRepeatedPasswordInput().type(users.cypress.password);
        accountPage.getPasswordSaveButton().click();
        cy.contains("Passwort aktualisiert", {timeout: 10000}).should('exist');
        currentCorrectPassword=users.cypress.password;
        loginPage.login(users.cypress.mail, users.cypress.password)
        sidebar.getSettingsButton().click();
        accountPage.getFirstnameInput().should('have.value', users.cypress.firstname);
        accountPage.getLastnameInput().should('have.value', users.cypress.lastname);
        accountPage.getMailInput().should('have.value', users.cypress.mail);
    });
});
