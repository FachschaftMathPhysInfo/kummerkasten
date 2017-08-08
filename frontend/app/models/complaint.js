import DS from 'ember-data';
const { attr,belongsTo, hasMany } = DS;
export default DS.Model.extend({
  approved:attr('boolean'),
  reviewed:attr('boolean'),
  title:attr('string'),
  course:belongsTo('course'),
  message:attr('string'),
  createdAt:attr('date'),
});
