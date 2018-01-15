import Ember from 'ember';
import dialogManagment from "admin/mixins/dialog-managment";
export default Ember.Controller.extend(dialogManagment,{
  paperToaster:Ember.inject.service(),
  currentSemester:null,
  showEditSemesterDialog:false,
    showDeleteSemesterDialog:false,
    year:new Date(),
  actions:{
    saveSemester:function(){
      this.store.createRecord('semester',{name:this.get('name'),lsfId:this.get('lsfid'),year:this.get('year')}).save().then(()=>{
        this.get('paperToaster').show("Semester erfolgreich gespeichert",{duration:4000});
      }).catch((errorMessage)=>{
        this.get('paperToaster').show("Semester konnte nicht gespeichert werden! Grund: "+errorMessage,{duration:4000});
      });
    },
    editSemester:function(semester){
      this.set('currentSemester',semester);
      this.set('showEditSemesterDialog',true);
    },
    deleteSemester:function(semester){
      this.set('currentSemester',semester);
      this.set('showDeleteSemesterDialog',true);
    },
    closeEditDialog:function(option){
      this.closeEditDialog("Semester","Semester",option);
    },
    closeDeleteSemesterDialog:function(option){
        this.closeDeleteDialog("Semester",option);
      },

    }
});
