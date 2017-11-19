import Ember from 'ember';
import { A } from '@ember/array';
import { computed } from '@ember/object';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  page: 1,
  limitOptions: A([10, 15, 20]),
  limit:10,
  resultsLength:computed('meta.record-count',function(){
    return this.get("meta.record-count");
  }),
  pages: computed('meta.page-count', function() {
    let e = A();
    for (let i = 1; i <= this.get("meta.page-count"); i++) {
      e.pushObject(i);
    }
    return e;
  }),

  simpleMdeOptions:{
    toolbar: false,
    previewRender: true,
  },
  paperToaster:Ember.inject.service(),
  paginatedResults: computed('page', 'limit', function() {
    let filter=this.get("filter");
    let result= this.get("store").query("complaint", {
      filter,
      page: {
        number: this.get('page'),
        size: this.get("limit")
      },
      include:"lecturers"
    });
    result.then((data) => {
      this.set("meta", data.get("meta"));
    })
    return result;
  }),
  page: 1,
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
    //console.log(JSON.stringify(complaint.get('message')));
    complaint.set('reviewed',true);
    complaint.set('approved',true);
    complaint.save();
  },
  reject:function(complaint){
    complaint.set('reviewed',true);
    complaint.set('approved',false);
    complaint.save();
  }
  }
});
