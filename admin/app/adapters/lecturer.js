import JSONAPIAdapter from './application';

export default JSONAPIAdapter.extend({
  urlForQueryRecord(query) {
    if (query.reset) {
      delete query.reset;
      return `${this._super(...arguments)}/reset`;
    }
    return this._super(...arguments);
  }
});
