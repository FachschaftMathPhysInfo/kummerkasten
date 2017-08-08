import Ember from 'ember';
import DS from 'ember-data';
export default Ember.Controller.extend({
  session:Ember.inject.service('session'),
  paperToaster:Ember.inject.service(),
  selectedSemester:Ember.computed('model.semesters.[]',function(){
    return this.get('model.semesters').objectAt(0);
  }),
  actions:{
    login:function(){
      let {email,password}=this.getProperties('email','password');
      this.get('session').authenticate('authenticator:oauth2',email,password).catch((reason)=>{
        this.set('errorMessage',reason.error);
      });
    },
    logout:function(){
      this.get('session').invalidate();
    },
    searchCourses: function(data) {
      var store = this.get('store');
      return store.query('course', {
        filter: {
          coursesearch: '%' + data + '%',
          semester: this.get('seletedSemester'),
        },
        page: {
          limit: 10
        }
      })
    },
    clearCourse:function(){
      this.set('selectedCourse',null);
      Ember.$("md-autcomplete-wrap input").focus();
    },
  sendComplaint:function(){

    //$('#input-ember702').chaunge();
    this.get('store').createRecord('complaint',{
      message:this.get('message'),
      title:this.get('title'),
      approved:false,
      reviewed:false,
      course:this.get('selectedCourse')
    }).save().then(()=>{

      this.set('message','');
      this.set('title','');
      click('md-autocomplete-wrap button');
      $('md-autocomplete-wrap button')[0].focus();
      this.get('paperToaster').show("Kummer gespeichert.", {duration: 4000});
    }).catch(()=>{
      this.get('paperToaster').show("Kummer konnte nicht gespeichert werden.", {
  duration: 4000
});
    });
  },
  focusTitle:function(){
    if(this.get('selectedCourse')){
      Ember.$("#input-3").focus();
    }
  },
  searchString:function(course){
    var a =' <em>';
    return DS.PromiseObject.create({
        promise: course.get('lecturers').then((list)=>{
                list.forEach((item)=>{
        a+=item.get('surname');
        if(item!=course.get('lecturers.lastObject')){
          a+=', ';
        }
        else {
          a+='</em> ';
          a+=course.get('faculty.name');
        }
      });
      console.log(a);
      return a;
    })
    });
  }
}
});
