import Ember from 'ember';
import DS from 'ember-data';
const { attr,belongsTo, hasMany } = DS;
export default DS.Model.extend({
  complaints:hasMany('complaint'),
  name:attr('string'),
  faculty:belongsTo('faculty'),
  coursetype:belongsTo('coursetype'),
  lecturers:hasMany('lecturer'),
  semester:belongsTo('semester'),
  lecturernames:attr('string'),
  facultyname:attr('string'),
  semestername:attr('string'),
  lsfId:attr('number'),
  complaintCount:attr('number')
});
