import DS from 'ember-data';
const { attr,belongsTo, hasMany } = DS;
export default DS.Model.extend({
  salutation:attr('string'),
  surname:attr('string'),
  givenname:attr('string'),
  email:attr('string'),
  createdAt:attr('date'),
  readcomplaints:hasMany('complaint'),
  complaints:hasMany('complaint'),
  courses:hasMany('course')
});
