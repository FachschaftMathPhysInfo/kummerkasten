import Ember from 'ember';
import DS from 'ember-data';
const { attr,belongsTo, hasMany } = DS;
export default DS.Model.extend({
  complaints:hasMany('complaint'),
  name:attr('string'),
  faculty:belongsTo('faculty'),
  coursetype:attr('coursetype'),
  createdAt:attr('date'),
  lecturers:hasMany('lecturer'),
  semester:belongsTo('semester'),
  lecturerssearch: Ember.computed('lecturers.[]',function(){
    var a ='';
    return DS.PromiseObject.create({
        promise: this.get('lecturers').then((list)=>{
                list.forEach((item)=>{
        a+=item.get('surname');
        if(item!=this.get('lecturers.lastObject')){
          a+=', ';
        }
      });
      return a;
    })
    });
  }),
  facultyname: Ember.computed('faculty',function(){
    return DS.PromiseObject.create({
        promise: this.get('faculty').then((fac)=>{
          return fac.get('name');
        })
      });
  }),
});
