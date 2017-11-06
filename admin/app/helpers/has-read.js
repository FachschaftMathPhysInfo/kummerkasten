import Ember from 'ember';

export function hasRead(params/*, hash*/) {
  return new Ember.RSVP.Promise((fullfill,)=>{
  params[0].get('readers').then((list)=>{
    fullfill( list.includes(params[1]));
  });});
}

export default Ember.Helper.helper(hasRead);
