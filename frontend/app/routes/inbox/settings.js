import Ember from 'ember';

export default Ember.Route.extend({
  currentUser: Ember.inject.service('current-user'),
  model(){
    return this.get('currentUser.user');
  }
});
