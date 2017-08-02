class Lecturer < ApplicationRecord
  has_many :lectures
  has_many :has_reads
  has_many :complaints, :through => :lectures
  has_many :readcomplaints, :through => :has_reads
end
