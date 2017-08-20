import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

const { service } = Ember.inject;
export default Ember.Route.extend(ApplicationRouteMixin,{
  currentUser:service(),
  session: service('session'),
  beforeModel() {
   return this._loadCurrentUser();
 },
 sessionAuthenticated() {
   this._super(...arguments);
   this._loadCurrentUser();
 },
  _loadCurrentUser() {
    if(this.get("session.isAuthenticated")){
   return this.get('currentUser').load();
 }
 return true;
 },
});
