import Devise from 'ember-simple-auth/authorizers/devise';

export default Devise.extend({
  identificationAttributeName:"email",
  tokenAttributeName:"token"
});
