class Complaint < ApplicationRecord
  has_many :lecturers, :through => :course
  has_many :has_reads
  belongs_to :course
  has_many :readers, :through => :has_reads, source: :lecturer, class_name: "Lecturer"
end
