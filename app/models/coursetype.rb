class Coursetype < ApplicationRecord
  has_many :courses, dependent: :destroy
end
