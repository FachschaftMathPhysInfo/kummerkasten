import Ember from 'ember';
export default Ember.Controller.extend({

 router: Ember.inject.service(),
 currentRouteName: Ember.computed.reads('router.currentRouteName'),
});
