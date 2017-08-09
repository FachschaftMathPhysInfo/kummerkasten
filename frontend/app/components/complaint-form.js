import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement(){
    $('textarea')[0].setAttribute("required",true);
  },
  placeholder:"Hier könnte Ihre Nachricht stehen!",
  paperToaster:Ember.inject.service(),
  //message:"",
  store: Ember.inject.service(),
  selectedSemester: Ember.computed('model.semesters.[]', function() {
    return this.get('model.semesters').objectAt(0);
  }),
  actions: {
    searchCourses: function(data) {
      var store = this.get('store');
      var searchstringarray = data.split(" ");
      //searchstringarray.forEach((item,index)=>{searchstringarray[index]='%'+item+'%'});
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
      Ember.$("md-autcomplete-wrap input").focus();
    },
    sendComplaint: function() {

      //$('#input-ember702').chaunge();
      this.get('store').createRecord('complaint', {
        message: this.get('message'),
        approved: false,
        reviewed: false,
        course: this.get('selectedCourse')
      }).save().then(() => {
        this.set('message', '');
        this.set('selectedCourse', null);
        this.set('searchText', '');
        $('md-autocomplete-wrap input').get(0).setAttribute('value','');
        //Ember.$('md-autocomplete-wrap button').get(0).click();
        $('form').get(0).reset();

        //$('md-autocomplete-wrap button')[0].focus();
        this.get('paperToaster').show("Kummer gespeichert.", {
          duration: 4000
        });
      }).catch(() => {
        this.get('paperToaster').show("Kummer konnte nicht gespeichert werden.", {
          duration: 4000
        });
      });
    },
    focusMessage: function() {
      if (this.get('selectedCourse')) {
        $("textarea")[1].focus();
      }
    },
  }
});
