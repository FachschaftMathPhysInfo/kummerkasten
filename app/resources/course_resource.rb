class CourseResource < JSONAPI::Resource
  has_one :semester
  has_one :coursetype
  has_one :faculty
  has_many :lectures
  has_many :lecturers
  has_many :complaints
  attributes :name
  filters :coursesearch, :lecturers, :name, :semester
  filter :coursesearch, apply: ->(records, value, _options) {
    value_regex = Array.wrap(value).join('|')
    records.joins("INNER JOIN lectures m1 ON m1.course_id = courses.id").joins("INNER JOIN lecturers m2 ON m2.id = m1.lecturer_id WHERE name ILIKE '#{value_regex}' OR m2.surname ILIKE '#{value_regex}'")
  }
end
