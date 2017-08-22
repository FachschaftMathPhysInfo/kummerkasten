class LecturerComplaintMailer < ApplicationMailer
  default from: 'notifications@mathphys.stura.uni-heidelberg.de'

def unread_email(lecturer)
  @lecturer = lecturer
  @url  = 'http://kummerkasten.mathphys.stura.uni-heidelberg.de/'
  @managment_url = 'http://kummerkasten.mathphys.stura.uni-heidelberg.de/inbox/settings'
  mail(to: @lecturer.email, subject: "[Kummerkasten] #{@lecturer.unnotifiedcomplaints.size} neue, ungelesene Kummernachrichten")
end
end
