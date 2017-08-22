class Unnotifiedcomplaint < ApplicationRecord
  belongs_to :lecturer
  belongs_to :complaint
  before_create :set_due_to_now
 def set_due_to_now
   self.due = Time.now
 end
end
