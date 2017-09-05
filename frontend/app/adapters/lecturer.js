import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord(query) {
    if (query.me) {
      delete query.me;
      return `${this._super(...arguments)}/me`;
    }
    if (query.reset) {
      delete query.reset;
      return `${this._super(...arguments)}/reset`;
    }

    return this._super(...arguments);
  }
});
