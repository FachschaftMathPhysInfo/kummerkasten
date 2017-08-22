class LecturersController < ApplicationController
  before_action :authenticate_lecturer!
  def me
    a=Object.new
    ob= current_lecturer
    class << a
      attr_accessor :type,:attributes,:id
    end
    a.attributes=ob
    a.type="lecturers"
    a.id=ob.id
    render json: {data:a}
  end
end
