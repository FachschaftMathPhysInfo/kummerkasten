class CourseResource < JSONAPI::Resource
  has_one :semester
  has_one :coursetype
  has_one :faculty
  has_many :lectures
  has_many :complaints
  attributes :name
  filter :name, apply: ->(records, value, _options) {
    records.where("name ILIKE '#{value[0]}'")
  }
  filters  :semester, :faculty
end
