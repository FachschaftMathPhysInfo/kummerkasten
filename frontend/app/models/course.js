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
});
