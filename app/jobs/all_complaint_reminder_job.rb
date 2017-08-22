class AllComplaintReminderJob < ApplicationJob
  queue_as :default

  def perform(*args)
    Lecturer.find_each do |l|
          if l.unnotifiedcomplaints.size>0
            if l.unnotifiedcomplaints.first.due <Time.now
              LecturerComplaintMailer.unread_email(l).deliver_now
              l.unnotifiedcomplaints.delete_all
            end
          end
    end
  end
end
