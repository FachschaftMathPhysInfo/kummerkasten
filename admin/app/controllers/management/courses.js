import Ember from 'ember';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Ember.Controller.extend({
  paperToaster:Ember.inject.service(),
  currentCourse:null,
  showEditCourseDialog:false,
  showDeleteCourseDialog:false,
  selectedlecturers: [],
  limitOptions: A([10, 20, 30]),
  limit: 10,
  page: 1,
  searchLecturers: A(),
  searchName:Ember.computed('searchtemp',function(){
    return this.get('searchtemp.name');
  }),
  pages: computed('meta.page-count', function() {
    let e = A();
    for (let i = 1; i <=this.get("meta.page-count"); i++) {
      e.pushObject(i);
    }
    return e;
  }),
  resultsLength:computed('meta.record-count', function() {
    return this.get("meta.record-count");
  }),
  paginatedResults:Ember.computed('limit','page','searchLecturers.[]', 'searchLsfid', 'searchName', 'searchCoursetype', 'searchSemester', 'searchFaculty', function() {
    let lecturers = [];
    if (this.get("searchLecturers") != null) {
      this.get("searchLecturers").forEach((item) => {
        lecturers.pushObject(item.get("id"));
      });
    }
    let ergebnis = this.get('store').query('course', {
      filter: {
        faculty: this.get('searchFaculty.id'),
        semester: this.get('searchSemester.id'),
        coursetype: this.get('searchCoursetype.id'),
        lecturers: lecturers,
        lsfId: this.get('searchLsfid'),
        nameilike: this.get('searchName')
      },
      page: {
        size: this.get('limit'),
        number: this.get('page'),
      }
    });
    ergebnis.then((data) => {
      this.set("meta",data.meta);
    });
    return ergebnis;
  }),
  actions:{
    searchName:function(data){
        return this.get('store').query('course', {
          filter: {
            nameilike: data
          },
          page: {
            limit: 10
          }
        })
    },
    addLecturer: function(data) {
      this.selectedlecturers.pushObject(data);
    },
    removeLecturer: function(data) {
      this.selectedlecturers.removeObject(data);
    },
    addLecturertoSearch: function(data) {
      this.searchLecturers.pushObject(data);
    },
    removeLecturerfromSearch: function(data) {
      this.searchLecturers.removeObject(data);
    },
    saveCourse:function(){
      this.store.createRecord('course',{name:this.get('name'),coursetype:this.get('coursetype'),faculty:this.get('faculty'),semester:this.get('semester'),lecturers:this.get('selectedlecturers')}).save().then(()=>{
        this.get('paperToaster').show("Veranstaltung erfolgreich gespeichert",{duration:4000});
        this.set('name',"");
        this.set('lsfid',null);
        this.set('coursetype',null);
        this.set('faculty',null);
        this.set('semester',null);
        this.set('selectedlecturers',null);
      }).catch((errorMessage)=>{
        this.get('paperToaster').show("Veranstaltung konnte nicht gespeichert werden! Grund: "+errorMessage,{duration:4000});
      });
    },
    editCourse:function(course){
      this.set('currentCourse',course);
      this.set('showEditCourseDialog',true);
    },
    searchinLecturers:function(data){
      return this.store.query('lecturer', { filter: {surname:data}});
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
