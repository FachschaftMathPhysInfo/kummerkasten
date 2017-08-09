class LecturersController < ApplicationController
  before_action :authenticate_lecturer!
  acts_as_token_authentication_handler_for Lecturer
end
