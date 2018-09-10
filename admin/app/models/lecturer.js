import DS from 'ember-data';
const { attr, hasMany } = DS;
import Ember from 'ember';
export default DS.Model.extend({
  salutation:attr('string'),
  surname:attr('string'),
  givenname:attr('string'),
  email:attr('string'),
  invite:attr('boolean'),
  wantsreview:attr('boolean'),
  notifications:attr('string'),
  unreadcomplaintsCount:attr('number'),
  password:attr('string'),
  //readcomplaints:hasMany('complaint'),
  //complaints:hasMany('complaint'),
  courses:hasMany('course'),
  lsfId:attr('number'),
  name:Ember.computed('surname','givenname',function(){
    return this.get('givenname')+" "+this.get('surname');
  })
});
