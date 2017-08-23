import Ember from 'ember';

export default Ember.Route.extend({
  model:function(){
    return Ember.RSVP.hash({courses:this.store.findAll('course'),alllecturers:this.store.findAll('lecturer')});
  
  }
});
