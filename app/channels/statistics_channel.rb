class StatisticsChannel < ApplicationCable::Channel
  def subscribed
     stream_from "statistics_channel"
  end
  def get
    ActionCable.server.broadcast('statistics_channel',
     newcomplaints:Complaint.where(created_at:(Time.now() -24.hours)..Time.now).size(),
    reviewedcomplaints:Complaint.where(reviewed:true).size,
    approvedcomplaints:Complaint.where(approved:true).size,
    coursesize:Course.count(),
    lecturerssize:Lecturer.count(),
    facultiessize:Faculty.count())
  end
  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
