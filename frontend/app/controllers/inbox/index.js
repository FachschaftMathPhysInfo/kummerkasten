import Ember from 'ember';
export default Ember.Controller.extend({
  currentUser: Ember.inject.service('current-user'),
  actions: {
    markasread(complaint){
      console.log(this.get('session'));
      let lect=this.get('session.content.authenticated');
      console.log(lect);
      let  record= this.store.createRecord('hasread',{complaint:complaint,
        lecturer:this.get("currentUser.user")});
      record.save().then(()=>{
        complaint.unloadRecord();
      });
    }
  }
});
