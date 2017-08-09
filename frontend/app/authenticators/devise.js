import Devise from 'ember-simple-auth/authenticators/devise';

export default Devise.extend({
  resourceName: 'data',
});
