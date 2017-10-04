import Ember from 'ember';

export default Ember.Controller.extend({
  cableService: Ember.inject.service('cable'),
  setupConsumer: Ember.on('init', function() {
   var consumer = this.get('cableService').createConsumer('wss://'+window.location.host+'/cable');
   this.subscription = consumer.subscriptions.create("StatisticsChannel" , {
     received: (data) => {
       console.log(data);
       this.set("newcomplaints",data.newcomplaints);
       this.set("reviewedcomplaints",data.reviewedcomplaints);
       this.set("approvedcomplaints",data.approvedcomplaints);
       this.set("coursesize",data.coursesize);
       this.set("lecturerssize",data.lecturerssize);
       this.set("facultiessize",data.facultiessize);
     },
     connected() {
        this.perform('get');
      }
   });
 }),
});
