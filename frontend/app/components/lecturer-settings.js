import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  paperToaster: Ember.inject.service(),
  actions: {
    changePassword: function() {
      return new Ember.RSVP.Promise((resolve,reject)=>{
      let headers=[];
      this.get("session").authorize("authorizer:devise", (headerName, headerValue) => {
        headers.push({name:headerName,value:headerValue});
        if(headers.length==2)
        Ember.$.ajax("/lecturers/update_password", {
          method: "PATCH",
          contentType:"application/vnd.api+json",
          beforeSend: function(xhr) {
            xhr.setRequestHeader(headers[0].name, headers[0].value);
            xhr.setRequestHeader(headers[1].name, headers[1].value);
          },
          success:function(){
            resolve(true);
          },

          data: JSON.stringify({
            lecturer: {
              password: this.get("password"),
              current_password: this.get("current_password"),
              password_confirmation: this.get("password_confirmation")
            }
          })
        }).fail(()=>{
          reject();
        });
      });
    }).then(()=>{
      this.get("paperToaster").show("Passwort erfolgreich geändert.",{timeout:4000});
    }).catch(()=>
  {
    this.get("paperToaster").show("Es ist ein Fehler aufgetreten. Passwörter stimmen nicht überein, sind nicht sicher genug oder das aktuelle ist falsch.",{timeout:4000});
  });
  }
  }
});
