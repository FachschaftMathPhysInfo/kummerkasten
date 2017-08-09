  class SessionsController < Devise::SessionsController
    def create
      self.resource = warden.authenticate!(auth_options)

      sign_in(resource_name, resource)

      yield resource if block_given?

      respond_to do |format|
        format.json do
          data = {
            email: resource.email,
            token: resource.authentication_token
          }

          render json: data, status: 201
        end

        format.html do
          respond_with resource, location: after_sign_in_path_for(resource)
        end
      end
    end
  end
