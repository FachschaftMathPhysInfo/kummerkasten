class ComplaintResource < JSONAPI::Resource
  attributes :approved, :message, :reviewed
  has_one :course
  has_many :has_reads
  has_many :lecturers
  before_create do
    self.approved=false
    self.reviewed=false
  end
end
