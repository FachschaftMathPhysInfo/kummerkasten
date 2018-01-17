import Ember from 'ember';
import dialogManagment from "admin/mixins/dialog-managment";

export default Ember.Controller.extend(dialogManagment,{
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
      this.closeEditDialog("Coursetype","Veranstaltungstyp",option);
    },
    closeDeleteCoursetypeDialog:function(option){
        this.closeDeleteDialog("Coursetype",option);
      },

    }
});
