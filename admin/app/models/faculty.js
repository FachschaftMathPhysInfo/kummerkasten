import DS from 'ember-data';
const { attr,belongsTo, hasMany } = DS;
export default DS.Model.extend({
  name:attr('string'),
  createdAt:attr('date'),
  courses:hasMany('course'),
  lsfId:attr('number')
});
