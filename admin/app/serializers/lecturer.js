import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  serialize(){
    let json =this._super(...arguments);
    delete json.data.attributes['unreadcomplaints-count'];
    delete json.data.attributes['name'];
    delete json.data.attributes['password'];
    return json;
  }
});
