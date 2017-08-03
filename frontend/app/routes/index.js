import Ember from 'ember';

export default Ember.Route.extend({
  model:function(){
  return Ember.RSVP.hash({faculties: this.store.findAll('faculty')});
  }
});
