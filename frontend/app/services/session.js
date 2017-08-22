import SessionService from 'ember-simple-auth/services/session';

export default SessionService.extend({
  authenticator:'devise',
  authorizer:'devise'
});
