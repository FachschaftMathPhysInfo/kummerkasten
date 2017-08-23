import DS from 'ember-data';
const { belongsTo } = DS;
export default DS.Model.extend({
    lecturer:belongsTo('lecturer'),
    complaint:belongsTo('complaint')
});
