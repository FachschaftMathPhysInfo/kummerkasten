class LecturerResource < BaseResource
  attributes :email, :surname, :givenname, :salutation, :notifications, :lsf_id
  has_many :hasreads
  has_many :courses
  has_many :complaints, class_name:"Complaint"
  has_many :readcomplaints, class_name:"Complaint"
  has_many :unreadcomplaints
  attribute :unreadcomplaints_count
  def unreadcomplaints_count
    @model.unreadcomplaints.size
  end
end
