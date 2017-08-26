import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  serialize(){
    let json =this._super(...arguments);
    delete json.data.attributes['lecturernames'];
    delete json.data.attributes['facultyname'];
    delete json.data.attributes['semestername'];
    delete json.data.attributes['complaint-count'];
    return json;
  }
});
