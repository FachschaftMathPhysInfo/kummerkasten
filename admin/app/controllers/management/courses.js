import Ember from 'ember';

export default Ember.Controller.extend({
  paperToaster:Ember.inject.service(),
  currentCourse:null,
  showEditCourseDialog:false,
  showDeleteCourseDialog:false,
  selected_lecturers: [],
  limitOptions: Ember.A([5, 10, 15]),
  limit: 5,
  pages: Ember.computed('limit', 'results.[]', function() {
    let e = Ember.A();
    for (let i = 1; i < Math.ceil(this.get("results.length") / this.get("limit")); i++) {
      e.pushObject(i);
    }
    return e;
  }),
  page: 1,
  searchLecturers: Ember.A(),
  searchName:Ember.computed('searchtemp',function(){
    return this.get('searchtemp.name');
  }),
  results:Ember.computed('searchLecturers.[]', 'searchLsfid', 'searchName', 'searchCoursetype', 'searchSemester', 'searchFaculty', function() {
    this.set("loading", true);
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
      }
    });
    ergebnis.then(() => {
      this.set("loading", false);
    });
    return ergebnis;
  }),
  paginatedResults: Ember.computed('results.[]', 'page', 'limit', function() {
    let ind = (this.get('page') - 1) * this.get('limit');
    return Ember.A(this.get("results").toArray().slice(ind, ind + this.get('limit')));
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
      this.selected_lecturers.pushObject(data);
    },
    removeLecturer: function(data) {
      this.selected_lecturers.removeObject(data);
    },
    addLecturertoSearch: function(data) {
      this.searchLecturers.pushObject(data);
    },
    removeLecturerfromSearch: function(data) {
      this.searchLecturers.removeObject(data);
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
      decrementPage() {
      let page = this.get('page');
      if (page > 0) {
        this.set('page', page - 1);
      }
    },
    incrementPage() {
      let page = this.get('page');
      let max = this.get('pages').reduce((prev, curr) => curr > prev
        ? curr
        : prev, 0);
      if (page < max) {
        this.set('page', page + 1);
      }
    },
    }
});
