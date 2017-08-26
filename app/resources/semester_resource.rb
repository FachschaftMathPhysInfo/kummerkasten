class SemesterResource < BaseResource
  has_many :courses
  attributes :name, :year, :lsf_id
  def self.default_sort
    [{field: 'year', direction: :desc}]
  end
  paginator :offset
end
