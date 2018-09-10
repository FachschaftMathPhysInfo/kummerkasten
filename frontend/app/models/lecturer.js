import DS from 'ember-data';
const { attr, hasMany } = DS;
export default DS.Model.extend({
  salutation:attr('string'),
  surname:attr('string'),
  givenname:attr('string'),
  email:attr('string'),
  wantsreview:attr('boolean'),
  notifications:attr('string'),
  //readcomplaints:hasMany('complaint'),
  //complaints:hasMany('complaint'),
  courses:hasMany('course')
});
