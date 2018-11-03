class SemesterResource < BaseResource
  has_many :courses
  attributes :name, :year, :lsf_id, :archived
  def self.default_sort
    [{field: 'year', direction: :desc}]
  end
  def archived=(value)
    @model.archived=value
    @model.courses.each do |course|
      course.archived = value
      course.save
    end
  end
end
