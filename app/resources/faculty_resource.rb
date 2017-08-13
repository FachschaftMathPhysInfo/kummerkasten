class FacultyResource < BaseResource
  has_many :courses
  attributes :name
end
