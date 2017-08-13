class ComplaintsController < ApplicationController
  acts_as_token_authentication_handler_for Lecturer
  private

  def context
    {user: current_lecturer, test:"fall"}
  end

  def user_not_authorized
    head :forbidden
  end
end
