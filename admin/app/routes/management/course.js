import Ember from 'ember';

export default Ember.Route.extend({
  model:function(params){
    return Ember.RSVP.hash({course:this.store.find('course',params.id),lecturers:this.store.findAll('lecturer'),coursetypes:this.store.findAll('coursetype'),faculties:this.store.findAll('faculty'),semesters:this.store.findAll('semester')});
  }
});
