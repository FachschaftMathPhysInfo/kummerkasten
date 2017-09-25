import Ember from 'ember';

export function firstLine(params/*, hash*/) {
  return params[0].split('\n')[0];
}

export default Ember.Helper.helper(firstLine);
