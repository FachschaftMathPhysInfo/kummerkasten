import Ember from 'ember';
import DS from 'ember-data';
export default Ember.Component.extend({
  store: Ember.inject.service(),
  objekttyp:Ember.computed('objekt',function(){
    return this.get('objekt').get('constructor.modelName')}),
  elemente: Ember.computed('objekt',function(){
    switch(this.get('objekt').get('constructor.modelName')){
      case 'coursetype' :
        return 'Veranstaltungstyp';
        break;
      case 'faculty' :
        return 'Fakultät';
        break;
      case 'semester' :
        return 'Semester';
        break;
      case 'lecturer' :
        return 'Dozierendes';
        break;
    }
  }),
  dieseselements: Ember.computed('objekt',function() {
    //console.log(this.get('objekt'));
    if(this.get('objekt')==null) return '';
    switch (this.get('objekt').get('constructor.modelName')){
      case 'coursetype' :
        return 'dieses Veranstaltungstyp';
        break;
      case 'faculty' :
        return 'dieser Fakultät';
        break;
      case 'semester' :
        return 'dieses Semesters';
        break;
      case 'lecturer' :
        return 'dieses Dozierendes';
        break;
    }
  }),
  actions: {
    exitDialog: function(option) {
      if (option == "ok") {
        let zusatz='';
        if(this.get('objekt.constructor.modelName')=='lecturer'){
          zusatz='s';
        }
        this.get('objekt.courses').forEach((course) => {
          if (course.get(this.get('objekt.constructor.modelName') + zusatz).length==1){
            course.destroyRecord();
          }
        });
      }
      this.sendAction('closeDialog', option);
    },
    multiple: function(course) {
      let zusatz='';
      if(this.get('objekt.constructor.modelName')=='lecturer'){
        zusatz='s';
      }
      return DS.PromiseObject.create({
        promise: course.get(this.get('objekt.constructor.modelName') + zusatz).then((list) => {
          return list.length > 1;
        })
      });
    },
  }
});
