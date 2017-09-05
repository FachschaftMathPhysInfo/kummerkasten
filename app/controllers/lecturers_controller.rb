class LecturersController < ApplicationController
  before_action :authenticate_lecturer!, only: [:me,:update_password]
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
  def reset
    l= Lecturer.find(params["id"])
    passw= SecureRandom.base64(12)
    l.update({password:passw,password_confirmation:passw})
    LecturerResetPasswordMailer.reset(l,passw).deliver_now
    render json: {status:"ok"}
  end
  def update_password
        @lecturer = Lecturer.find(current_lecturer.id)
        p lecturer_params
        if @lecturer.valid_password?(lecturer_params["current_password"])
     if @lecturer.update({password:lecturer_params["password"],password_confirmation:lecturer_params["password_confirmation"]})
       # Sign in the user by passing validation in case their password changed
       bypass_sign_in(@lecturer)
       render json: {status:"ok"}
    else render json: {status:"failed"}, status: :forbidden
     end
   else render json: {status:"failed"}, status: :forbidden
   end
  end
  private

  def lecturer_params
    # NOTE: Using `strong_parameters` gem
    params.require(:lecturer).permit(:current_password,:password, :password_confirmation)
  end
end
