import Ember from 'ember';
import moment from 'moment';
export default Ember.Controller.extend({
  paperToaster:Ember.inject.service(),
  currentSemester:null,
  showEditSemesterDialog:false,
    showDeleteSemesterDialog:false,
    year:moment().toDate(),
  actions:{
    saveSemester:function(){
      console.log(this.get('year'));
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
      if(option=="ok"){
        this.get('currentSemester').save().then(()=>{
          this.get('paperToaster').show("Semester erfolgreich gespeichert",{duration:4000});
        }).catch((errorMessage)=>{
          this.get('paperToaster').show("Semester konnte nicht gespeichert werden! Grund: "+errorMessage,{duration:4000});
        });
        this.set('showEditSemesterDialog',false);
      }
      else{
        this.get('currentSemester').rollback();
        this.set('showEditSemesterDialog',false);
      }
    },
    closeDeleteSemesterDialog:function(option){
        this.set("showDeleteSemesterDialog",false);
        if(option=="ok"){
          this.get('currentSemester').destroyRecord();
        }
        else {
          this.set('currentSemester',null);
        }
      },

    }
});
