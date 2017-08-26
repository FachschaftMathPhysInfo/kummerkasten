import Ember from 'ember';

export default Ember.Controller.extend({
  init: function () {
    this._super();
    Ember.run.schedule("afterRender",this,function() {
      this.send("whydoIhavetodothis");
    });
  },
  paperToaster:Ember.inject.service(),
  store: Ember.inject.service(),
  editable:false,
  showDeleteCourseDialog:false,
  actions:{
    addLecturer: function(data) {
      this.get('model.lecturers').pushObject(data);
    },
    removeLecturer: function(data) {
      this.get('model.lecturers').removeObject(data);
    },
    editButton:function(){
      if(this.get('editable')){
        this.model.rollback();
        this.set('editable',false);
      }
      else{
        this.set('editable',true);
      }
    },
      whydoIhavetodothis: function() {
        this.get('store').findAll('lecturer').then((list)=>{
          this.set('lecturers',list);
        });
        this.get('store').findAll('coursetype').then((list)=>{
          this.set('coursetypes',list);
        });
        this.get('store').findAll('semester').then((list)=>{
          this.set('semesters',list);
        });
        this.get('store').findAll('faculty').then((list)=>{
          this.set('faculties',list);
        });
      },
    exitEdit:function(option){
      if(option=="ok"){
        this.get('model').save().then(()=>{
          this.get('paperToaster').show("Veranstaltung erfolgreich gespeichert",{duration:4000});
          this.set('editable',false);
        }).catch((errorMessage)=>{
          this.get('paperToaster').show("Veranstaltung konnte nicht gespeichert werden! Grund: "+errorMessage,{duration:4000});
        });
      }
      else{
        this.get('model').rollback();
        this.set('editable',false);
      }
    },
    closeDeleteCourseDialog:function(option){
        this.set("showDeleteCourseDialog",false);
        if(option=="ok"){
          this.transitionToRoute('management.courses');
          this.get('model').destroyRecord();
        }
      },
  }
});
