import users from "../fixtures/users.json"
import * as accountPage from "../pages/accountsettings.po"

describe('Profile Settings Page', () => {
    beforeEach(() => {
        cy.login(users.admin.mail, users.admin.password)
        cy.visit("/account")
    })

    describe('User Data and Form Format', () => {
        it('should load existing user data into the form fields', () => {
            cy.get('[data-cy="account-firstname-input"]').should('have.value', users.admin.firstname);
            cy.get('[data-cy="account-lastname-input"]').should('have.value', users.admin.lastname);
            cy.get('[data-cy="account-mail-input"]').should('have.value', users.admin.mail);
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
    });

    describe('Validation Errors - Empty Fields', () => {
        it('shows validation errors for empty field firstname', () => {
            cy.get('[data-cy="account-firstname-input"]').should('have.value', users.admin.firstname);
            accountPage.getFirstnameInput().clear()
            cy.get('[data-cy="input-profile-save"]').click();
            accountPage.getFirstnameMessage()
                .scrollIntoView()
                .should('contain', 'Vorname ist erforderlich');
        });
        it('shows validation errors for empty field lastname', () => {
            cy.get('[data-cy="account-lastname-input"]').should('have.value', users.admin.lastname);
            accountPage.getLastnameInput().clear()
            cy.get('[data-cy="input-profile-save"]').click();
            accountPage.getLastnameMessage()
                .scrollIntoView()
                .should('contain', 'Nachname ist erforderlich');
        });
        it('shows validation errors for empty field email', () => {
            cy.get('[data-cy="account-mail-input"]').should('have.value', users.admin.mail);
            accountPage.getMailInput().clear()
            cy.get('[data-cy="input-profile-save"]').click();
            accountPage.getMailMessage()
                .scrollIntoView()
                .should('contain', 'Ungültige E-Mail-Adresse');
        });
    })

    describe('Validation Errors - Wrong Inputs', () => {
        it('shows validation errors for field email upon non-unique mail', () => {
            cy.get('[data-cy="account-mail-input"]').should('have.value', users.admin.mail);
            accountPage.getMailInput().clear()
            accountPage.getMailInput().type(users.fsles1.mail)
            cy.get('[data-cy="input-profile-save"]').click();
            accountPage.getMailMessage()
                .scrollIntoView()
                .should('contain', 'Diese E-Mail-Adresse wird bereits verwendet');
        });
    })

    describe('Account Data - Leading Whitespaces', () => {
        it('removes leading whitespaces - firstname', () => {
            accountPage.getFirstnameInput().should('have.value', users.admin.firstname);
            accountPage.getFirstnameInput().clear()
            accountPage.getFirstnameInput().type(' ' + users.admin.firstname)
            cy.get('[data-cy="input-profile-save"]').click();
            cy.reload();
            accountPage.getFirstnameInput().should('have.value', "Admin");
        });

        it('removes leading whitespaces - lastname', () => {
            accountPage.getLastnameInput().should('have.value', users.admin.lastname);
            accountPage.getLastnameInput().clear()
            accountPage.getLastnameInput().type(' ' + users.admin.lastname)
            cy.get('[data-cy="input-profile-save"]').click();
            cy.reload();
            accountPage.getLastnameInput().should('have.value', "Kummerkasten");
        });

        //leading whitespaces on mail do not need to be tested because it counts as invalid mail format
    })

    describe('Account Data - Trailing Whitespaces', () => {
        it('removes trailing whitespaces - firstname', () => {
            accountPage.getFirstnameInput().should('have.value', users.admin.firstname);
            accountPage.getFirstnameInput().clear()
            accountPage.getFirstnameInput().type(users.admin.firstname + ' ')
            cy.get('[data-cy="input-profile-save"]').click();
            cy.reload();
            accountPage.getFirstnameInput().should('have.value', "Admin");
        });

        it('removes trailing whitespaces - lastname', () => {
            accountPage.getLastnameInput().should('have.value', users.admin.lastname);
            accountPage.getLastnameInput().clear()
            accountPage.getLastnameInput().type(users.admin.lastname + ' ')
            cy.get('[data-cy="input-profile-save"]').click();
            cy.reload();
            accountPage.getLastnameInput().should('have.value', "Kummerkasten");
        });
        //trailing whitespaces on mail do not need to be tested because it counts as invalid mail format
    })

    describe('Password Form - Input Errors', () => {
        it('shows error if old password is empty', () => {
            accountPage.getNewPasswordInput().type('StrongPass1!');
            accountPage.getRepeatedPasswordInput().type('StrongPass1!');
            accountPage.getSettingsSaveButton().click();

            accountPage.getCurrentPasswordMessage().should('contain', 'Bitte gib dein aktuelles Passwort ein.');
        });

        it('shows error if new password is less than 8 characters', () => {
            accountPage.getCurrentPasswordInput().type(users.admin.password);
            accountPage.getNewPasswordInput().type('Ab1!');
            accountPage.getRepeatedPasswordInput().type('Ab1!');
            accountPage.getSettingsSaveButton().click();

            accountPage.getNewPasswordMessage().should('contain', 'Mindestens 8 Zeichen.');
        });

        it('shows error if new password has no uppercase letter', () => {
            accountPage.getCurrentPasswordInput().type(users.admin.password);
            accountPage.getNewPasswordInput().type('strongpass1!');
            accountPage.getRepeatedPasswordInput().type('strongpass1!');
            accountPage.getSettingsSaveButton().click();

            accountPage.getNewPasswordMessage().should('contain', 'Mindestens ein Großbuchstabe.');
        });

        it('shows error if new password has no number', () => {
            accountPage.getCurrentPasswordInput().type(users.admin.password);
            accountPage.getNewPasswordInput().type('StrongPass!');
            accountPage.getRepeatedPasswordInput().type('StrongPass!');
            accountPage.getSettingsSaveButton().click();

            accountPage.getNewPasswordMessage().should('contain', 'Mindestens eine Zahl.');
        });

        it('shows error if new password has no special character', () => {
            accountPage.getCurrentPasswordInput().type(users.admin.password);
            accountPage.getNewPasswordInput().type('StrongPass1');
            accountPage.getRepeatedPasswordInput().type('StrongPass1');
            accountPage.getSettingsSaveButton().click();

            accountPage.getNewPasswordMessage().should('contain', 'Mindestens ein Sonderzeichen.');
        });

        it('shows error if confirm password does not match', () => {
            accountPage.getCurrentPasswordInput().type(users.admin.password);
            accountPage.getNewPasswordInput().type('StrongPass1!');
            accountPage.getRepeatedPasswordInput().type('WrongPass1!');
            accountPage.getSettingsSaveButton().click();
            accountPage.getRepeatedPasswordMessage().should('contain', 'Passwörter stimmen nicht überein.');
        });

        it('shows error when new password is same as old password', () => {
            accountPage.getCurrentPasswordInput().type(users.admin.password);
            accountPage.getNewPasswordInput().type('StrongPass1!');
            accountPage.getRepeatedPasswordInput().type('StrongPass1!');
            accountPage.getSettingsSaveButton().click();
            accountPage.getCurrentPasswordInput().type('StrongPass1!');
            accountPage.getNewPasswordInput().type('StrongPass1!');
            accountPage.getRepeatedPasswordInput().type('StrongPass1!');
            accountPage.getSettingsSaveButton().click();
            accountPage.getNewPasswordMessage().should('contain', 'Neues Passwort darf nicht dem alten entsprechen.');
        });


    });

    describe('Password Form - Wrong Passwords', () => {
        it('shows an error when the current password is incorrect', () => {
            const invalidPassword = 'WrongPassword123!';
            accountPage.getCurrentPasswordInput().type(invalidPassword);
            accountPage.getNewPasswordInput().type('ValidNewPass1!');
            accountPage.getRepeatedPasswordInput().type('ValidNewPass1!');
            accountPage.getSettingsSaveButton().click();
            accountPage.getCurrentPasswordMessage().should('contain', 'Falsches aktuelles Passwort.')
        });

        it('shows an error when the new and repeated passwords do not match', () => {
            accountPage.getCurrentPasswordInput().type(users.admin.password);
            accountPage.getNewPasswordInput().type('ValidNewPass1!');
            accountPage.getRepeatedPasswordInput().type('DifferentPass1!');
            accountPage.getSettingsSaveButton().click();
            accountPage.getRepeatedPasswordMessage().should('contain', 'Passwörter stimmen nicht überein.');
        });
    })

    describe('Password - Correct Inputs', () => {
        it('accepts valid password and enables save button', () => {
            accountPage.getCurrentPasswordInput().type(users.admin.password);
            accountPage.getNewPasswordInput().type('StrongPass1!');
            accountPage.getRepeatedPasswordInput().type('StrongPass1!');
            accountPage.getSettingsSaveButton().should('not.be.disabled');
        });
    })


});
