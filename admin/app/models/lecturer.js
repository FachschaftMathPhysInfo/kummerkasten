import DS from 'ember-data';
const { attr,belongsTo, hasMany } = DS;
export default DS.Model.extend({
  salutation:attr('string'),
  surname:attr('string'),
  givenname:attr('string'),
  email:attr('string'),
  notifications:attr('string'),
  unreadcomplaints:hasMany('complaint'),
  unreadcomplaints_count:attr('number'),
  //readcomplaints:hasMany('complaint'),
  //complaints:hasMany('complaint'),
  courses:hasMany('course'),
  lsfId:attr('number')
});
