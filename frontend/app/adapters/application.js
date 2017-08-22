import Ember from 'ember';
import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const { String: { pluralize, underscore } } = Ember;

export default JSONAPIAdapter.extend(DataAdapterMixin,{
  authorizer: 'authorizer:devise',
  pathForType(type) {
    return pluralize(underscore(type));
  }
});
