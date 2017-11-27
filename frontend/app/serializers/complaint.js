import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  serialize(){
    let json =this._super(...arguments);
    delete json.data.attributes['created-at'];
    delete json.data.relationships['lecturers'];
    return json;
  }
});
