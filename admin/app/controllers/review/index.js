import Ember from 'ember';

export default Ember.Controller.extend({
  filter:{reviewed:false},
  store:Ember.inject.service(),
  paperToaster:Ember.inject.service(),
  actions: {
    onApprove(complaint){
      complaint.set("approved",true);
      complaint.set("reviewed",true);
      complaint.save().then(()=>{
        this.get("paperToaster").show("Kummer erfolgreich freigeschaltet.",{duration:4000});
        complaint.unloadRecord();
      });
    },
    onDismiss(complaint){
      complaint.set("approved",false);
      complaint.set("reviewed",true);
      complaint.save().then(()=>{
        this.get("paperToaster").show("Kummer abgelehnt.",{duration:4000});
        complaint.unloadRecord();
      });
    }
  }
});
