import Ember from 'ember';

export default Ember.Controller.extend({
  //cable stuff
  cableService: Ember.inject.service('cable'),
  subscription:null,
  currentStatus:"Importiervorgang nicht gestartet",
  invite:false,
  setupConsumer: Ember.on('init', function() {
   var consumer = this.get('cableService').createConsumer('ws://'+window.location.host+'/cable');
   this.subscription = consumer.subscriptions.create("ImportNotificationsChannel" , {
     received: (data) => {
      this.set("currentStatus",data.message);
      this.set('importing',data.importing);
     }
   });
 }),
  importing:false,
  actions: {
    searchFaculty(text){
      return this.store.query('faculty', { filter: {name:text}});
    },
    startImporting(){
      console.log(this.get("selectedSemester"));
      this.get("subscription").perform("start",{invite:this.get("invite"),faculty:this.get("faculty"),term:this.get("selectedSemester.lsfId")});
    }
  }
});
