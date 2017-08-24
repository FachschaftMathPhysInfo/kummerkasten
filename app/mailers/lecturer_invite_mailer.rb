class LecturerInviteMailer < ApplicationMailer
  def welcome(lecturer,temp_password)
    @lecturer = lecturer
    @temp_password = temp_password
    @url  = 'http://kummerkasten.mathphys.stura.uni-heidelberg.de/'
    @url_password_change = 'http://kummerkasten.mathphys.stura.uni-heidelberg.de/inbox/settings'
    mail(to: @lecturer.email, subject: "Registrierung Kummerkasten")
  end
end
