import Ember from 'ember';

export default Ember.Controller.extend({
  session:Ember.inject.service('session'),
  currentUser: Ember.inject.service('current-user'),
  paperToaster:Ember.inject.service(),
  actions:{
    login:function(){
      let {email,password}=this.getProperties('email','password');
      this.get('session').authenticate('authenticator:devise',email,password).catch((reason)=>{
        this.set('errorMessage',reason.error);
      });
    },
    logout:function(){
      this.get('session').invalidate();
    },
    markasread(complaint){
      console.log(this.get('session'));
      let lect=this.get('session.content.authenticated');
      console.log(lect);
      let  record= this.store.createRecord('hasread',{complaint:complaint,
        lecturer:this.get("currentUser.user")});
      console.log(record);
      record.save();
    }
}
});
