import {UserRole} from "../../../lib/graph/generated/graphql";
import * as page from "../../pages/labels/label-management.po"
import * as dialog from "../../pages/labels/label-dialog.po";
import labels from "../../fixtures/labels.json";
import * as kummerform from "../../pages/kummerform.po";

const roles: UserRole[] = [UserRole.Admin, UserRole.User]

describe("Label Dialog Tests", () => {
  roles.forEach((role) => {
    context(`${role} tests`, () => {
      beforeEach(() => {
        cy.loginAsRole(role)
        cy.visit("/labels")
      })

      context('Create Labels', () => {
        beforeEach(() => {
          page.getCreateLabelButton().click()
        })

        it('shows the whole dialog', () => {
          dialog.getDialog().should('be.visible')
          dialog.getNameInput().should('be.visible')
          dialog.getColorPicker().should('be.visible')
          dialog.getColorInput().should('be.visible')
          dialog.getIsPublicCheckbox().should('be.visible')
          dialog.getCancelButton().should('be.visible')
          dialog.getSubmitButton().should('be.visible')
        })

        it('closes on cancel button', () => {
          dialog.cancel()

          dialog.getDialog().should('not.exist')
        })

        it('shows errors on empty submit', () => {
          dialog.submit()

          dialog.getNameInputMessage().should('be.visible')
          dialog.getColorInputMessage().should('not.exist')
        })

        it('shows error on already taken name', () => {
          dialog.fillOutForm(labels.lineare_algebra.name, labels.lineare_algebra.color, labels.lineare_algebra.public)
          dialog.submit()

          dialog.getNameInputMessage().should('be.visible')
        });

        it('shows error on invalid hexcode', () => {
          dialog.fillOutForm(undefined, "#AE")
          dialog.submit()

          dialog.getColorInputMessage().should('be.visible')
        });

        it('does not save on cancel', () => {
          dialog.fillOutForm(labels.test1.name, labels.test1.color)
          dialog.cancel()

          page.getLabelRows().contains('Test Label 1').should('not.exist')
        });

        it('creates label on valid submit', () => {
          dialog.fillOutForm(labels.test1.name, labels.test1.color, labels.test1.public)
          dialog.submit()

          dialog.getDialog().should('not.exist')
          page.getLabelRows().contains(labels.test1.name).should('be.visible')
        })

        after(() => cy.deleteLabels([labels.test1.name, labels.test2.name]))
      })

      context('Edit Labels', () => {
        const newColorHex = '#FF0000'
        const newColorRGB = 'rgb(255, 0, 0)'

        it('edits name', () => {
          const newName = 'andere lineare algebra'
          page.openEditOfLabel(labels.lineare_algebra.name)
          dialog.typeName(newName)
          dialog.submit()

          dialog.getDialog().should('not.exist')
          page.getLabelRows().contains(newName).should('be.visible')

          // CLEANUP
          cy.deleteLabels([newName])
        });

        it('edits color', () => {
          page.openEditOfLabel(labels.lineare_algebra.name)
          dialog.typeColor(newColorHex)
          dialog.submit()

          dialog.getDialog().should('not.exist')
          page.getLabelRows()
            .contains(labels.lineare_algebra.name)
            .should('have.css', 'background-color', newColorRGB)
        });

        it('makes label public', () => {
          page.openEditOfLabel(labels.lineare_algebra.name)
          dialog.getIsPublicCheckbox().click()
          dialog.submit()
          cy.visit("/")

          kummerform.getLabels().contains(labels.lineare_algebra.name).should('be.visible')
        });

        it('makes labels private', () => {
          page.openEditOfLabel(labels.fachschaft.name)
          dialog.getIsPublicCheckbox().click()
          dialog.submit()
          cy.visit("/")

          kummerform.getLabels().contains(labels.fachschaft.name).should('not.exist')

          // CLEANUP
          cy.deleteLabels([labels.fachschaft.name])
          cy.createLabel(labels.fachschaft)
        });

        it('does not allow edit of already taken name', () => {
          page.openEditOfLabel(labels.lineare_algebra.name)
          dialog.typeName(labels.fachschaft.name)
          dialog.submit()

          dialog.getNameInputMessage().should('be.visible')
        });

        afterEach(() => {
          cy.deleteLabels([labels.lineare_algebra.name])
          cy.createLabel(labels.lineare_algebra)
        })
      })
    })
  })
})