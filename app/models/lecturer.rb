class Lecturer < ApplicationRecord
  has_many :lectures
  has_many :has_reads
  has_many :courses, :through => :lectures
  has_many :complaints, :through => :courses
  has_many :readcomplaints, :through => :has_reads
  # devise :database_authenticatable, :registerable,:recoverable, :rememberable, :trackable, :validatable
  # before_save :ensure_authentication_token
  # def ensure_authentication_token
  #   if authentication_token.blank?
  #     self.authentication_token = generate_authentication_token
  #   end
  # end
  # private
  #   def generate_authentication_token
  #     loop do
  #       token = Devise.friendly_token
  #       break token unless Lecturer.where(authentication_token: token).first
  #     end
  #   end
end
