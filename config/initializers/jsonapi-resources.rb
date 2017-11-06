# config/initializers/jsonapi-resources.rb
JSONAPI.configure do |config|
  config.top_level_meta_include_page_count = true
  config.top_level_meta_page_count_key = :page_count
  config.top_level_meta_include_record_count = true
  config.top_level_meta_record_count_key = :record_count
  config.default_paginator = :paged
  config.default_processor_klass = JSONAPI::Authorization::AuthorizingProcessor
  config.exception_class_whitelist = [Pundit::NotAuthorizedError,EmberCli::EmberController]
end
JSONAPI::Authorization.configure do |config|
  # or a block can be provided
  config.pundit_user = ->(context){ p context
    context[:user] }
end
