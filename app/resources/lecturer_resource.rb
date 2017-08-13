class LecturerResource < BaseResource
  attributes :email, :surname, :givenname, :salutation
  has_many :has_reads
  has_many :courses
  has_many :complaints, class_name:"Complaint"
  has_many :readcomplaints, class_name:"Complaint"
end
