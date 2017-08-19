class Course < ApplicationRecord
  belongs_to :semester
  belongs_to :faculty
  belongs_to :coursetype
  has_many :complaints
  has_many :lectures
  has_many :lecturers, :through => :lectures
end
