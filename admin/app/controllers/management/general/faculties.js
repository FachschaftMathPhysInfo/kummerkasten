import Ember from 'ember';

export default Ember.Controller.extend({
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
      if(option=="ok"){
        this.get('currentFaculty').save().then(()=>{
          this.get('paperToaster').show("Fakultät erfolgreich gespeichert",{duration:4000});
        }).catch((errorMessage)=>{
          this.get('paperToaster').show("Fakultät konnte nicht gespeichert werden! Grund: "+errorMessage,{duration:4000});
        });
        this.set('showEditFacultyDialog',false);
      }
      else{
        this.get('currentFaculty').rollback();
        this.set('showEditFacultyDialog',false);
      }
    },
    closeDeleteFacultyDialog:function(option){
        this.set("showDeleteFacultyDialog",false);
        if(option=="ok"){
          this.get('currentFaculty').destroyRecord();
        }
        else {
          this.set('currentFaculty',null);
        }
      },

    }
});
