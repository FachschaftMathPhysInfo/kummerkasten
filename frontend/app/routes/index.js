import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend({
  model:function(){
    return Ember.RSVP.hash({semesters:this.store.findAll('semester')});
  }
});
