class ComplaintResource < BaseResource
  attributes :approved, :message, :reviewed
  has_one :course
  has_many :hasreads
  has_many :lecturers
  filter :read, apply: ->(records, value, _options) {
     return records.joins(:hasreads).where(hasreads: { lecturer: _options[:context][:user] })
  }
  filter :unread, apply: ->(records,value,_options) {
    return records.where.not(id:records.joins(:hasreads).where(hasreads:{lecturer:_options[:context][:user]}))
  }
  before_create do
    self.approved=false
    self.reviewed=false
  end
end
