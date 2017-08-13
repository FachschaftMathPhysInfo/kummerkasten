class ComplaintResource < BaseResource
  attributes :approved, :message, :reviewed
  has_one :course
  has_many :has_reads
  has_many :lecturers
  before_create do
    self.approved=false
    self.reviewed=false
  end
  def self.records(options)
    p options
    raise "Not logged in" if options.nil?
    context = options[:context]
    context[:user].complaints
  end
end
