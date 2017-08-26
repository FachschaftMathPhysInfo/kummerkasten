import Ember from 'ember';
import DS from 'ember-data';
export default Ember.Component.extend({
  actions: {
    exitDialog:function(option){
      this.sendAction('closeDialog', option);
    },
  }
});
