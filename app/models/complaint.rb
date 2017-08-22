class Complaint < ApplicationRecord
  belongs_to :course
  has_many :lecturers, :through => :course
  has_many :hasreads
  has_many :readers, :through => :hasreads, source: :lecturer, class_name: "Lecturer"
end
