import Ember from 'ember';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import pageManagment from "admin/mixins/page-managment";

export default Ember.Component.extend(pageManagment,{
  store: Ember.inject.service(),
  simpleMdeOptions:{
    toolbar: false,
    previewRender: true,
  },
  paperToaster:Ember.inject.service(),
  paginatedResults: computed('page', 'limit','course', function() {
    //let filter=this.get("filter");
    let result= this.get("store").query("complaint", {
      filter: { course: this.get('course.id') },
      page: {
        number: this.get('page'),
        size: this.get("limit")
      },
      include:"lecturers,readers"
    });
    result.then((data) => {
      this.set("meta", data.get("meta"));
    })
    return result;
  }),
  actions:{
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
  approve:function(complaint){
    complaint.set('reviewed',true);
    complaint.set('approved',true);
    complaint.save().then(()=>{
      complaint.unloadRecord();
    });
  },
  reject:function(complaint){
    complaint.set('reviewed',true);
    complaint.set('approved',false);
    complaint.save().then(()=>{
      complaint.unloadRecord();
    });
  }
  }
});
