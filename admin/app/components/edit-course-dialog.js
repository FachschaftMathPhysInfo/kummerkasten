import Ember from 'ember';

export default Ember.Component.extend({
  actions:{
    exitDialog:function(option){
      this.sendAction('closeDialog',option);
    },
    addLecturer: function(data) {
      this.get('course.lecturers').pushObject(data);
    },
    removeLecturer: function(data) {
      this.get('course.lecturers').removeObject(data);
    },
  }
});
