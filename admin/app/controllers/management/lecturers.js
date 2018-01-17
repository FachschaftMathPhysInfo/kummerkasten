import Ember from 'ember';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import dialogManagment from "admin/mixins/dialog-managment";

export default Ember.Controller.extend(dialogManagment,{
  paperToaster: Ember.inject.service(),
  currentLecturer: null,
  showEditLecturerDialog: false,
  showDeleteLecturerDialog: false,
  invite:true,
  limitOptions:A([10,20,30]),
  limit:10,
  page:1,
  pages: computed('meta.page-count', function() {
    let e = A();
    for (let i = 1; i <=this.get("meta.page-count"); i++) {
      e.pushObject(i);
    }
    return e;
  }),
  resultsLength:computed('meta.record-count', function() {
    return this.get("meta.record-count");
  }),
  paginatedLecturers: computed('page','limit', function() {
    let ergebnis = this.get('store').query('lecturer', {
      page: {
        size: this.get("limit"),
        number:this.get("page")
      }
    });
    ergebnis.then((data) => {
      this.set("meta",data.meta);
    });
    return ergebnis;
  }),
  actions: {
    resendPasswordtoLecturer: function(lec) {
      if (confirm("Passwort auf zufälligen Wert setzten und per EMail Dozierenden mitteilen?")) {
        this.store.queryRecord('lecturer', {
          id: lec.get("id"),
          reset: true
        });
      }
    },
    saveLecturer: function() {
      this.store.createRecord('lecturer', {
        invite: this.get("invite"),
        surname: this.get('surname'),
        givenname: this.get('givenname'),
        lsfId: this.get('lsfid'),
        email: this.get('email'),
        salutation: this.get('salutation'),
        password: "nichtsicher",
        notifications:"every"
      }).save().then(() => {
        this.get('paperToaster').show("Dozierendes erfolgreich gespeichert", {duration: 4000});
        this.set('surname', "");
        this.set('lsfid', null);
        this.set('givenname', "");
        this.set('email', "");
        this.set('salutation', "");
      }).catch((errorMessage) => {
        this.get('paperToaster').show("Dozierendes konnte nicht gespeichert werden! Grund: " + errorMessage, {duration: 4000});
      });
    },
    editLecturer: function(lecturer) {
      this.set('currentLecturer', lecturer);
      this.set('showEditLecturerDialog', true);
    },
    deleteLecturer: function(lecturer) {
      this.set('currentLecturer', lecturer);
      this.set('showDeleteLecturerDialog', true);
    },
    closeEditDialog: function(option) {
      this.closeEditDialog("Lecturer","Dozierendes",option);
    },
    closeDeleteLecturerDialog: function(option) {
      this.closeDeleteDialog("Lecturer",option);
    }
  }
});
