import Ember from 'ember';

export default Ember.Route.extend({
  model:function(){
    return this.store.queryRecord('lecturer',{me:true});
  }
});
