class Course < ApplicationRecord
  belongs_to :semester
  belongs_to :faculty
  belongs_to :coursetype
  has_many :complaints, dependent: :destroy
  has_many :lectures, dependent: :destroy
  has_many :lecturers, :through => :lectures
end
