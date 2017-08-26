import Ember from 'ember';

export default Ember.Controller.extend({
  paperToaster:Ember.inject.service(),
  currentLecturer:null,
  showEditLecturerDialog:false,
  showDeleteLecturerDialog:false,
  actions:{
    saveLecturer:function(){
      this.store.createRecord('lecturer',{surname:this.get('surname'),givenname:this.get('givenname'),lsfId:this.get('lsfid'),email:this.get('email'),salutation:this.get('salutation')}).save().then(()=>{
        this.get('paperToaster').show("Veranstaltung erfolgreich gespeichert",{duration:4000});
        this.set('surname',"");
        this.set('lsfid',null);
        this.set('givenname',"");
        this.set('email',"");
        this.set('salutation',"");
      }).catch((errorMessage)=>{
        this.get('paperToaster').show("Dozierendes konnte nicht gespeichert werden! Grund: "+errorMessage,{duration:4000});
      });
    },
    editLecturer:function(lecturer){
      this.set('currentLecturer',lecturer);
      this.set('showEditLecturerDialog',true);
    },
    deleteLecturer:function(lecturer){
      this.set('currentLecturer',lecturer);
      this.set('showDeleteLecturerDialog',true);
    },
    closeEditDialog:function(option){
      if(option=="ok"){
        this.get('currentLecturer').save().then(()=>{
          this.get('paperToaster').show("Dozierendes erfolgreich gespeichert",{duration:4000});
        }).catch((errorMessage)=>{
          this.get('paperToaster').show("Dozierendes konnte nicht gespeichert werden! Grund: "+errorMessage,{duration:4000});
        });
        this.set('showEditLecturerDialog',false);
      }
      else{
        this.get('currentLecturer').rollback();
        this.set('showEditLecturerDialog',false);
      }
    },
    closeDeleteLecturerDialog:function(option){
        this.set("showDeleteLecturerDialog",false);
        if(option=="ok"){
          this.get('currentLecturer').destroyRecord();
        }
        else {
          this.set('currentLecturer',null);
        }
      },

    }
});
