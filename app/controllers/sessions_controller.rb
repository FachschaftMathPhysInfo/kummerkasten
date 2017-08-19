  class SessionsController < Devise::SessionsController
     respond_to :html, :json
    def create
      self.resource = warden.authenticate!(auth_options)
      sign_in(resource_name, resource)
      p resource
      p resource_name
      yield resource if block_given?

      respond_with do |format|
        format.json do
          data = {
            email: self.resource.email,
            authentication_token: self.resource.authentication_token
          }
          render json: data, status: 201
        end

        format.html do
          respond_with resource, location: after_sign_in_path_for(resource)
        end
      end
    end
  end
