class ApplicationController < ActionController::API
  include Pundit
  include JSONAPI::ActsAsResourceController
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  acts_as_token_authentication_handler_for Lecturer,fallback: :none, only:[:index]
  def pundit_user
    p "Hallo, hallo"
    current_lecturer
  end
#  protect_from_forgery
  public
  def current_user
    p current_lecturer
    p current_lecturer
    current_lecturer
  end
  private
  def context
    p "allarmm"
    p current_lecturer
    {user: current_lecturer, lecturer:current_lecturer}
  end

  def user_not_authorized
    head :forbidden
  end
end
