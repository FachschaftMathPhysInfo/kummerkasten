class ApplicationController < ActionController::API
  include Pundit
  include JSONAPI::ActsAsResourceController
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  acts_as_token_authentication_handler_for Lecturer,fallback: :none
  def pundit_user
    current_lecturer
  end
#  protect_from_forgery
  public
  def current_user
    current_lecturer
  end
  public
  def context
    {user: current_lecturer, lecturer:current_lecturer}
  end

  def user_not_authorized
    head :forbidden
  end
end
