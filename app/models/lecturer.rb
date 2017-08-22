class Lecturer < ApplicationRecord
  has_many :lectures
  has_many :hasreads
  has_many :unnotifiedcomplaints
  has_many :courses, :through => :lectures
  has_many :complaints, :through => :courses
  has_many :readcomplaints, :through => :hasreads, :source => :complaint, class_name: "Complaint"
  def unreadcomplaints
    self.complaints - self.readcomplaints
  end
  devise :database_authenticatable, :registerable,:recoverable, :rememberable, :trackable, :validatable
  acts_as_token_authenticatable
end
