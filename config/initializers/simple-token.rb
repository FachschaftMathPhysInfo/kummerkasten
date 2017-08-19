
SimpleTokenAuthentication.configure do |config|

  # Configure the session persistence policy after a successful sign in,
  # in other words, if the authentication token acts as a signin token.
  # If true, user is stored in the session and the authentication token and
  # email may be provided only once.
  # If false, users must provide their authentication token and email at every request.
  config.sign_in_token = false
  config.identifiers = { lecturer: 'email' }
  config.header_names = { lecturer: { authentication_token: 'X-User-Token', email: 'X-User-Email' } }
end
