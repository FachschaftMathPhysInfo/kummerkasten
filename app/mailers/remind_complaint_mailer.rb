class RemindComplaintMailer < ApplicationMailer
  default from: 'notifications@mathphys.stura.uni-heidelberg.de'

def unchecked_email()
  @comment_count = Complaint.where("created_at > ?", 7.days.ago).count
  @not_processed = Complaint.where("created_at > ? AND reviewed=?", 7.days.ago,false).count
  mail(to: "fachschaft@mathphys.stura.uni-heidelberg.de", subject: "[Kummerkasten] #{@comment_count} neue, nichtfreigeschaltete Kummernachrichten")
end
end
