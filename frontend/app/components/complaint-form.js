import Ember from 'ember';

export default Ember.Component.extend({
  placeholder:"Hier könnte Ihre Nachricht stehen!",
  paperToaster:Ember.inject.service(),
  store: Ember.inject.service(),
  selectedSemester: Ember.computed('model.semesters.[]', function() {
    return this.get('model.semesters').objectAt(0);
  }),
  actions: {
    searchCourses: function(data) {
      var store = this.get('store');
      var searchstringarray = data.split(" ");
      return store.query('course', {
        filter: {
          coursesearch: searchstringarray,
          semester: this.get('seletedSemester'),
        },
        page: {
          limit: 10
        }
      })
    },
    clearCourse: function() {
      this.set('selectedCourse', null);
    },
    sendComplaint: function() {
      this.get('store').createRecord('complaint', {
        message: this.get('message'),
        approved: false,
        reviewed: false,
        course: this.get('selectedCourse')
      }).save().then(() => {
        this.set('message', '');
        this.set('selectedCourse', null);
        this.set('searchText', '');
        this.get('paperToaster').show("Kummer gespeichert.", {
          duration: 4000
        });
      }).catch(() => {
        this.get('paperToaster').show("Kummer konnte nicht gespeichert werden.", {
          duration: 4000
        });
      });
    },
  }
});
