class Lecturer < ApplicationRecord
  has_many :lectures, dependent: :destroy
  has_many :hasreads, dependent: :destroy
  has_many :unnotifiedcomplaints, dependent: :destroy
  has_many :courses, :through => :lectures, dependent: :destroy
  has_many :complaints, :through => :courses, dependent: :destroy
  has_many :readcomplaints, :through => :hasreads, :source => :complaint, class_name: "Complaint"
  def unreadcomplaints
    self.complaints - self.readcomplaints
  end
  devise :database_authenticatable, :registerable,:recoverable, :rememberable, :trackable, :validatable
  acts_as_token_authenticatable
end
