import DS from 'ember-data';
const { attr,belongsTo, hasMany } = DS;
export default DS.Model.extend({
  complaints:hasMany('complaint'),
  name:attr('string'),
  faculty:belongsTo('faculty'),
  coursetype:belongsTo('coursetype'),
  createdAt:attr('date'),
  lecturers:hasMany('lecturer'),
  semester:belongsTo('semester'),
  lecturernames:attr('string'),
  facultyname:attr('string'),
});
