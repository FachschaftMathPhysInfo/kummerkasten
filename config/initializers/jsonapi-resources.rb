# config/initializers/jsonapi-resources.rb
JSONAPI.configure do |config|
  p config
  config.default_processor_klass = JSONAPI::Authorization::AuthorizingProcessor
  config.exception_class_whitelist = [Pundit::NotAuthorizedError,EmberCli::EmberController]
end
