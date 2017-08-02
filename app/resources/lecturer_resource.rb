class LecturerResource < JSONAPI::Resource
  attributes :email, :surname, :givenname, :salutation
  has_many :courses
  has_many :has_reads
  has_many :complaints
  has_many :readcomplaints
end
