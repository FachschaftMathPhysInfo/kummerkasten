class SemesterResource < JSONAPI::Resource
  has_many :courses
  attributes :name, :year
  def self.default_sort
    [{field: 'year', direction: :desc}]
  end
  paginator :offset
end
