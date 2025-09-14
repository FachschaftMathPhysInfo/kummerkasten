import * as kummerform from "../pages/kummerform.po";
import kummerformstrings from "../fixtures/kummerform.json";

describe('Kummerform Page', () => {
    //no mail or password as we're testing for logged out for now

    let formLabels: any[] = [];
    let qaps: any[] = [];

    beforeEach(() => {

        cy.getFormLabels().then(fetchedFormLabels => {
            formLabels = fetchedFormLabels;
        });

        cy.getAllQAPs().then(fetchedQAPs => {
            qaps = fetchedQAPs;
        });

        cy.visit("/");
    });
    
    context('page elements', () => {
        it('should load the kummerform page correctly', () => {
            cy.url().should('include', '/');
            kummerform.getAboutText().should('exist');
            if (formLabels.length > 0) {
                kummerform.getFormLabel(formLabels[0].id).should('exist');
                kummerform.getFormLabelCheckbox(formLabels[0].id).should('exist');
                kummerform.getFormLabelName(formLabels[0].id).should('exist');
            }
            if (qaps.length > 0) {
                kummerform.getQAPs(qaps[0].id).should('exist');
            } else {
                kummerform.QAPEmpty().should('exist');
            }
        });

        it('should display form inputs', () => {
            kummerform.getTitleInput().should('exist');
            kummerform.getTextInput().should('exist');
        });


        it('should display buttons', () => {
            if (formLabels.length > 0) {
                kummerform.getFormLabelCheckbox(formLabels[0].id).should('exist');
            }
            kummerform.getSendButton().should('exist').and('be.visible');
        });
    });

    context('send kummerform', () => {
        beforeEach(() => {
            cy.reload()
        })

        it('shows the complete form', () => {
            
            it('shows all formLabels correctly', () => {
            if (formLabels.length > 0) {
                kummerform.getAllFormLabels().should('contain.value');
                for (let i = 0; i < formLabels.length; i++) {
                    kummerform.getFormLabel(formLabels[i].id).should('be.visible');
                    kummerform.getFormLabelCheckbox(formLabels[i].id).should('be.visible');
                    kummerform.getFormLabelName(formLabels[i].id).should('be.visible');
                }
            } 
            //will be addressed in future issue
            else kummerform.getFormLabel(formLabels[0].id).should('not.exist');
            })

            kummerform.getTitleInput().should('be.visible');
            kummerform.getTextInput().should('be.visible');
            kummerform.getSendButton().should('not.be.disabled');
        })

        it('shows no error on empty form - no submit', () => {
            kummerform.getLabelsMessage().should('not.exist');
            kummerform.getTitleMessage().should('not.exist');
            kummerform.getTextMessage().should('not.exist');
        })

        it ('shows error and disables submit on invalid submit - empty form', () => {
            kummerform.submit()  

            kummerform.getLabelsMessage().should('exist').and('have.length.above', 0).and('contain', "Bitte wähle mindestens ein Label aus.");
            kummerform.getTitleMessage().should('exist').and('have.length.above', 0).and('contain', "Die Zusammenfassung darf nicht leer sein.");
            kummerform.getTextMessage().should('exist').and('have.length.above', 0).and('contain', "Die Nachricht darf nicht leer sein.");
            kummerform.getSendButton().should('be.disabled');
        })

        it ('shows error and disables submit on invalid submit - empty labels', () => {
            kummerform.fillOutForm({title: "testtitle"});
            kummerform.fillOutForm({title: "testtext"});
            kummerform.submit()  

            kummerform.getLabelsMessage().should('exist').and('have.length.above', 0).and('contain', "Bitte wähle mindestens ein Label aus.");
            //kummerform.getTitleMessage().should('not.be.visible');
            //kummerform.getTextMessage().should('not.be.visible');
            kummerform.getSendButton().should('be.disabled');
        })

        it ('shows error and disables submit on invalid submit - empty title', () => {
            kummerform.fillOutForm({formLabelVal : [true, false , false, false], formLabelArray: formLabels, text: "testtext"}); //we have 4 formLabels in our seed data
            kummerform.submit()  

            //kummerform.getLabelsMessage().should('not.be.visible');
            kummerform.getTitleMessage().should('exist').and('have.length.above', 0).and('contain', "Die Zusammenfassung darf nicht leer sein.");
            //kummerform.getTextMessage().should('not.be.visible');
            kummerform.getSendButton().should('be.disabled');
        })

        it ('shows error and disables submit on invalid submit - empty text', () => {
            kummerform.fillOutForm({formLabelVal : [true, false , false, false], formLabelArray: formLabels, title: "testtitle"});
            kummerform.submit()  

            //kummerform.getLabelsMessage().should('not.be.visible');
            //kummerform.getTitleMessage().should('not.be.visible');
            kummerform.getTextMessage().should('exist').and('have.length.above', 0).and('contain', "Die Nachricht darf nicht leer sein.");
            kummerform.getSendButton().should('be.disabled');
        })

        it ('does not allow title input size over 70', () => {
            kummerform.fillOutForm({title : kummerformstrings.maxtitlelength.title})
            kummerform.getTitleInput().should('have.length.below', 71);
            kummerform.getSendButton().should('not.be.disabled');
        })

        it ('does not allow text input size over 3000', () => {
            kummerform.fillOutForm({text : kummerformstrings.maxtextlength.text})
            kummerform.getTitleInput().should('have.length.below', 3001);
            kummerform.getSendButton().should('not.be.disabled');
        })
    });
});