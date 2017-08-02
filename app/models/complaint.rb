class Complaint < ApplicationRecord
  has_many :lecturers, :through => :course
end
