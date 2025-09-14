import * as kummerform from "../pages/kummerform.po";

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
});
