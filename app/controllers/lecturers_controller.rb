class LecturersController < ApplicationController
  before_action :authenticate_lecturer!
end
