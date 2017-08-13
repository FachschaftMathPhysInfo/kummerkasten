class ApplicationController < ActionController::API
  include JSONAPI::ActsAsResourceController
  include Pundit
  include JSONAPI::ActsAsResourceController
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  def pundit_user
    current_lecturer
  end
#  protect_from_forgery
  private

  def context
    {user: current_lecturer}
  end

  def user_not_authorized
    head :forbidden
  end
end
