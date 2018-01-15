import Ember from 'ember';
import dialogManagment from "admin/mixins/dialog-managment";

export default Ember.Controller.extend(dialogManagment,{
  paperToaster:Ember.inject.service(),
  currentFaculty:null,
  showEditFacultyDialog:false,
    showDeleteFacultyDialog:false,
  actions:{
    saveFaculty:function(){
      this.store.createRecord('faculty',{name:this.get('name'),lsfId:this.get('lsfid')}).save().then(()=>{
        this.get('paperToaster').show("Fakultät erfolgreich gespeichert",{duration:4000});
      }).catch((errorMessage)=>{
        this.get('paperToaster').show("Fakultät konnte nicht gespeichert werden! Grund: "+errorMessage,{duration:4000});
      });
    },
    editFaculty:function(faculty){
      this.set('currentFaculty',faculty);
      this.set('showEditFacultyDialog',true);
    },
    deleteFaculty:function(faculty){
      this.set('currentFaculty',faculty);
      this.set('showDeleteFacultyDialog',true);
    },
    closeEditDialog:function(option){
      this.closeEditDialog("Faculty","Fakultät",option);
    },
    closeDeleteFacultyDialog:function(option){
        this.closeDeleteDialog("Faculty",option);
      },

    }
});
