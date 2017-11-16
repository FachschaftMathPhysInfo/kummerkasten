import Ember from 'ember';

export function hasRead(params/*, hash*/) {
  return new Ember.RSVP.Promise((fullfill,reject)=>{
  params[0].get('readers').then((list)=>{
    let read= false;
    list.forEach((i)=>{
      console.log(i.get("id"));
      console.log(params[1].get("id"));
      if(i.get("id")==params[1].get("id")) read=true;
    });
    console.log(read);
    fullfill(read);
  });});
}

export default Ember.Helper.helper(hasRead);
