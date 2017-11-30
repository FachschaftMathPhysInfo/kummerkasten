import Ember from 'ember';

export function hasRead(params/*, hash*/) {
  return new Ember.RSVP.Promise((fullfill,)=>{
  params[0].get('readers').then((list)=>{
    let read= false;
    list.forEach((i)=>{
      if(i.get("id")==params[1].get("id")) read=true;
    });
    fullfill(read);
  });});
}

export default Ember.Helper.helper(hasRead);
