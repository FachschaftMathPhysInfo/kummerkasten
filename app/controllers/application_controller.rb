class ApplicationController < ActionController::API
  include JSONAPI::ActsAsResourceController
#   before_action :authenticate_lecturer_from_token!, except: [ :index ]
#   private
#
#   def authenticate_lecturer_from_token!
#     authenticate_or_request_with_http_token do |token, options|
#       lecturer_email = options[:lecturer_email].presence
#       lecturer = lecturer_email && Lecturer.find_by_email(lecturer_email)
# 
#       if lecturer && Devise.secure_compare(lecturer.authentication_token, token)
#         sign_in lecturer, store: false
#       end
#     end
# end
end
