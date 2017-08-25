import Ember from 'ember';

export default Ember.Route.extend({
  model:function(){
    return Ember.RSVP.hash({semesters:this.store.findAll('semester'),faculties:this.store.findAll('faculty')});
  }
});
