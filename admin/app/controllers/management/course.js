import Ember from 'ember';

export default Ember.Controller.extend({
  paperToaster: Ember.inject.service(),
  store: Ember.inject.service(),
  editable: false,
  showDeleteCourseDialog: false,
  actions: {
    addLecturer: function(data) {
      this.get('model.course.lecturers').pushObject(data);
    },
    removeLecturer: function(data) {
      this.get('model.course.lecturers').removeObject(data);
    },
    editButton: function() {
      if (this.get('editable')) {
        this.model.rollback();
        this.set('editable', false);
      } else {
        this.set('editable', true);
      }
    },
    exitEdit: function(option) {
      if (option == "ok") {
        this.get('model.course').save().then(() => {
          this.get('paperToaster').show("Veranstaltung erfolgreich gespeichert", {
            duration: 4000
          });
          this.set('editable', false);
        }).catch((errorMessage) => {
          this.get('paperToaster').show("Veranstaltung konnte nicht gespeichert werden! Grund: " + errorMessage, {
            duration: 4000
          });
        });
      } else {
        this.get('model.course').rollback();
        this.set('editable', false);
      }
    },
    closeDeleteCourseDialog: function(option) {
      this.set("showDeleteCourseDialog", false);
      if (option == "ok") {
        this.transitionToRoute('management.courses');
        this.get('model.course').destroyRecord();
      }
    },
  }
});
