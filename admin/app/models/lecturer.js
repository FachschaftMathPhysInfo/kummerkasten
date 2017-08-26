import DS from 'ember-data';
const { attr,belongsTo, hasMany } = DS;
export default DS.Model.extend({
  salutation:attr('string'),
  surname:attr('string'),
  givenname:attr('string'),
  email:attr('string'),
  notifications:attr('string'),
  unreadcomplaintsCount:attr('number'),
  //readcomplaints:hasMany('complaint'),
  //complaints:hasMany('complaint'),
  courses:hasMany('course'),
  lsfId:attr('number'),
  name:Ember.computed('surname','givenname',function(){
    return this.get('givenname')+" "+this.get('surname');
  })
});
