import Ember from 'ember';

export default Ember.Controller.extend({
  paperToaster:Ember.inject.service(),
  actions:{
  save(){
    this.get('model').save().then(()=>{
      this.get('paperToaster').show("Änderungen erfolgreich gespeichert.", {
        duration: 4000
      });
    });
  }
}
});
