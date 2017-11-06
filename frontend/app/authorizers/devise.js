import Devise from 'ember-simple-auth/authorizers/devise';
import Ember from 'ember';
const { isEmpty } = Ember;
export default Devise.extend({
  tokenAttributeName:"authentication_token",
  /**
    Includes the user's token (see
    {{#crossLink "DeviseAuthenticator/tokenAttributeName:property"}}{{/crossLink}})
    and identification (see
    {{#crossLink "DeviseAuthenticator/identificationAttributeName:property"}}{{/crossLink}})
    in the `Authorization` header.

    @method authorize
    @param {Object} data The data that the session currently holds
    @param {Function} block(headerName,headerContent) The callback to call with the authorization data; will receive the header name and header content as arguments.
    @public
  */
  authorize(data, block) {
    const { tokenAttributeName, identificationAttributeName } = this.getProperties('tokenAttributeName', 'identificationAttributeName');
    const userToken = data[tokenAttributeName];
    const userIdentification = data[identificationAttributeName];

    if (!isEmpty(userToken) && !isEmpty(userIdentification)) {
      //const authData = `${tokenAttributeName}="${userToken}", ${identificationAttributeName}="${userIdentification}"`;
      block('X-User-Email', `${userIdentification}`);
      block('X-User-Token', `${userToken}`);
    }
  }
});
