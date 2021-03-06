import Devise from 'ember-simple-auth/authenticators/devise';

export default Devise.extend({
  identificationAttributeName: 'email',
  resourceName: 'lecturer',
  tokenAttributeName: 'authentication_token',
  serverTokenEndpoint:'lecturers/sign_in'
});
