import Ember from 'ember';

export default Ember.Controller.extend({
  selectedFaculty:null,
  selectedCourse:null,
  paperToaster:Ember.inject.service(),
  currentfaccourses: Ember.computed('selectedFaculty',function(){
    return new Ember.RSVP.Promise( (resolve,fail)=>
    {this.get('store').query('semester', {
      page: {
        limit: 1
      }}).then((data)=>{
        console.log(data);
        this.get('store').query('course',{
        filter:{
        semester: data.get('id'),
        faculty: this.get('selectedFaculty.id')
      }}).then((d)=>{
        resolve(d);
      });
    })
})
  }),
  actions:{
    searchCourses: function(data) {
      return this.get('store').query('course', {
        filter: {
          name: '%' + data + '%'
        },
        page: {
          limit: 10
        }
      })
  },
  sendComplaint:function(){
    this.get('store').createRecord('complaint',{
      message:this.get('message'),
      title:this.get('title'),
      approved:null,
      course:this.get('selectedCourse')
    }).save().then(()=>{
      this.get('paperToaster').show("Kummer gespeichert.", {
  duration: 4000
});
    }).catch(()=>{
      this.get('paperToaster').show("Kummer konnte nicht gespeichert werden.", {
  duration: 4000
});
    });
  }
}
});
