class SemesterResource < JSONAPI::Resource
  has_many :courses
  attributes :name, :year
end
