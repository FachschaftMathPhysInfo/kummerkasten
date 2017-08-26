import Ember from 'ember';

export default Ember.Controller.extend({
  paperToaster:Ember.inject.service(),
  currentCourse:null,
  showEditCourseDialog:false,
  showDeleteCourseDialog:false,
  selected_lecturers: [],
  actions:{
    addLecturer: function(data) {
      this.selected_lecturers.pushObject(data);
    },
    removeLecturer: function(data) {
      this.selected_lecturers.removeObject(data);
    },
    saveCourse:function(){
      this.store.createRecord('course',{name:this.get('name'),coursetype:this.get('coursetype'),faculty:this.get('faculty'),semester:this.get('semester'),lecturers:this.get('selected_lecturers')}).save().then(()=>{
        this.get('paperToaster').show("Veranstaltung erfolgreich gespeichert",{duration:4000});
        this.set('name',"");
        this.set('lsfid',null);
        this.set('coursetype',null);
        this.set('faculty',null);
        this.set('semester',null);
        this.set('selected_lecturers',null);
      }).catch((errorMessage)=>{
        this.get('paperToaster').show("Veranstaltung konnte nicht gespeichert werden! Grund: "+errorMessage,{duration:4000});
      });
    },
    editCourse:function(course){
      this.set('currentCourse',course);
      this.set('showEditCourseDialog',true);
    },
    deleteCourse:function(course){
      this.set('currentCourse',course);
      this.set('showDeleteCourseDialog',true);
    },
    closeEditDialog:function(option){
      if(option=="ok"){
        this.get('currentCourse').save().then(()=>{
          this.get('paperToaster').show("Veranstaltung erfolgreich gespeichert",{duration:4000});
        }).catch((errorMessage)=>{
          this.get('paperToaster').show("Veranstaltung konnte nicht gespeichert werden! Grund: "+errorMessage,{duration:4000});
        });
        this.set('showEditCourseDialog',false);
      }
      else{
        this.get('currentCourse').rollback();
        this.set('showEditCourseDialog',false);
      }
    },
    closeDeleteCourseDialog:function(option){
        this.set("showDeleteCourseDialog",false);
        if(option=="ok"){
          this.get('currentCourse').destroyRecord();
        }
        else {
          this.set('currentCourse',null);
        }
      },

    }
});
