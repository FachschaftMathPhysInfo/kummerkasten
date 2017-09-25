import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  lecturers: this.store.findAll('lecturer'),
  coursetypes: this.store.findAll('coursetype'),
  faculties: this.store.findAll('faculty'),
  semesters: this.store.findAll('semester'),
  actions: {
    exitDialog: function(option) {
      this.sendAction('closeDialog', option);
    },
    addLecturer: function(data) {
      this.get('course.lecturers').pushObject(data);
    },
    removeLecturer: function(data) {
      this.get('course.lecturers').removeObject(data);
    },
  }
});
