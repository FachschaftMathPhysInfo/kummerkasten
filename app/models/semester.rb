class Semester < ApplicationRecord
  has_many :courses, dependent: :destroy
end
