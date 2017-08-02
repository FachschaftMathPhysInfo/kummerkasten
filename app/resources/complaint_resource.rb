class ComplaintResource < JSONAPI::Resource
  attributes :approved, :name, :message
  has_one :course
  has_many :has_reads
  has_many :lecturers
end
