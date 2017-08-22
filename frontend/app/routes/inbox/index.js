import Ember from 'ember';

export default Ember.Route.extend({
  model:function(){
      return this.store.query('complaint', { filter:{unread: false}});
  }
});
