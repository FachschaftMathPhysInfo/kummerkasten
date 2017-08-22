class ComplaintResource < BaseResource
  attributes :approved, :message, :reviewed
  after_save :notify_lecturer
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
  def notify_lecturer
    @model.lecturers.each do |lecturer|
      zeit=Time.now
      case lecturer.notifications
      when "weekly" then
        zeit= Time.now.next_week
    when "daily" then
      zeit= Time.now.next_day
    when "never" then
      return ""
      end
      Unnotifiedcomplaint.create(lecturer:lecturer,complaint:@model,due:zeit).save
      ComplaintReminderJob.perform_later(lecturer) if lecturer.notifications=='every'

    end
  end
end
