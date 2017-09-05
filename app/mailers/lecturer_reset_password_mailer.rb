class LecturerResetPasswordMailer < ApplicationMailer
  def reset(lecturer,password)
    @password= password
    @lecturer =lecturer
    mail(to: @lecturer.email, subject: "Kummerkasten Passwort zurückgesetzt")
  end
end
