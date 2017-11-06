import DS from 'ember-data';
const { attr, hasMany } = DS;
export default DS.Model.extend({
  name:attr('string'),
  year:attr('date'),
  courses:hasMany('course'),
  lsfId:attr('number')
});
