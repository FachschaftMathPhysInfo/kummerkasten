class FacultyResource < BaseResource
  has_many :courses
  attributes :name, :lsf_id
end
