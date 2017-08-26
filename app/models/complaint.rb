class Complaint < ApplicationRecord
  belongs_to :course
  has_many :lecturers, :through => :course
  has_many :hasreads, dependent: :destroy
  has_many :readers, :through => :hasreads, source: :lecturer, class_name: "Lecturer"
end
