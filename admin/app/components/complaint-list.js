import Ember from 'ember';

export default Ember.Component.extend({
  limitOptions: Ember.A([5, 10, 15]),
  limit: 5,
  simpleMdeOptions:{
    toolbar: false,
    previewRender: true,
  },
  paperToaster:Ember.inject.service(),
  pages: Ember.computed('limit', 'complaints.[]', function() {
    let e = Ember.A();
    for (let i = 1; i <= Math.ceil(this.get("complaints.length")/this.get("limit")); i++) {
      e.pushObject(i);
    }
    return e;
  }),
  page: 1,
  paginatedResults: Ember.computed('complaints.[]', 'page', 'limit', function() {
    let ind = (this.get('page') - 1) * this.get('limit');
    return Ember.A(this.get("complaints").toArray().slice(ind, ind + this.get('limit')));
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
