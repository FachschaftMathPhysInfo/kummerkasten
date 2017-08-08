# class SessionsController < Devise::SessionsController
#   def create
#     respond_to do |format|
#       format.html { super }
#       format.json do
#         self.resource = warden.authenticate!(auth_options)
#         sign_in(resource_name, resource)
#         data = {
#           lecturer_token: self.resource.authentication_token,
#           lecturer_email: self.resource.email
#         }
#         render json: data, status: 201
#       end
#     end
#   end
# end
