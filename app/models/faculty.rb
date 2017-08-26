class Faculty < ApplicationRecord
  has_many :courses, dependent: :destroy
end
