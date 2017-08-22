class ComplaintReminderJob < ApplicationJob
  queue_as :default

  def perform(l)
      if l.unnotifiedcomplaints.size>0
        LecturerComplaintMailer.unread_email(l).deliver_now
        l.unnotifiedcomplaints.delete_all
      end
  end
end
