class Lecturer < ApplicationRecord
  has_many :lectures
  has_many :has_reads
  has_many :courses, :through => :lectures
  has_many :complaints, :through => :courses
  has_many :readcomplaints, :through => :has_reads
  devise :database_authenticatable, :registerable,:recoverable, :rememberable, :trackable, :validatable
  acts_as_token_authenticatable
end
