import Ember from 'ember';

export default Ember.Controller.extend({
  paperToaster:Ember.inject.service(),
  currentCoursetype:null,
  showEditCoursetypeDialog:false,
  showDeleteCoursetypeDialog:false,
  actions:{
    saveCoursetype:function(){
      this.store.createRecord('coursetype',{name:this.get('name')}).save().then(()=>{
        this.get('paperToaster').show("Veranstaltungstyp erfolgreich gespeichert",{duration:4000});
      }).catch((errorMessage)=>{
        this.get('paperToaster').show("Veranstaltungstyp konnte nicht gespeichert werden! Grund: "+errorMessage,{duration:4000});
      });
    },
    editCoursetype:function(coursetype){
      this.set('currentCoursetype',coursetype);
      this.set('showEditCoursetypeDialog',true);
    },
    deleteCoursetype:function(coursetype){
      this.set('currentCoursetype',coursetype);
      this.set('showDeleteCoursetypeDialog',true);
    },
    closeEditDialog:function(option){
      if(option=="ok"){
        this.get('currentCoursetype').save().then(()=>{
          this.get('paperToaster').show("Veranstaltungstyp erfolgreich gespeichert",{duration:4000});
        }).catch((errorMessage)=>{
          this.get('paperToaster').show("Veranstaltungstyp konnte nicht gespeichert werden! Grund: "+errorMessage,{duration:4000});
        });
        this.set('showEditCoursetypeDialog',false);
      }
      else{
        this.get('currentCoursetype').rollback();
        this.set('showEditCoursetypeDialog',false);
      }
    },
    closeDeleteCoursetypeDialog:function(option){
        this.set("showDeleteCoursetypeDialog",false);
        if(option=="ok"){
          this.get('currentCoursetype').destroyRecord();
        }
        else {
          this.set('currentCoursetype',null);
        }
      },

    }
});
