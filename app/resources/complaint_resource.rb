class ComplaintResource < BaseResource
  attributes :approved, :message, :reviewed
  has_one :course
  has_many :hasreads
  has_many :lecturers
  before_create do
    self.approved=false
    self.reviewed=false
  end
end
