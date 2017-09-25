import Ember from 'ember';

export function hasRead(params/*, hash*/) {
  params[0].get('readers').then((list)=>{
    return list.includes(params[1]);
  });
}

export default Ember.Helper.helper(hasRead);
