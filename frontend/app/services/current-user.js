import Ember from 'ember';

const { inject: { service }, RSVP } = Ember;

export default Ember.Service.extend({
  session: service('session'),
  store: service(),

  load() {
    if (this.get('session.isAuthenticated')) {
      return this.get('store').queryRecord('lecturer', { me: true }).then((user) => {
        this.set('user', user);
      });
    } else {
      return RSVP.resolve();
    }
  }
});
