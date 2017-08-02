class CourseResource < JSONAPI::Resource
  has_one :semester
  has_one :coursetype
  has_one :faculty
  has_many :lectures
  has_many :complaints
  attributes :name
end
