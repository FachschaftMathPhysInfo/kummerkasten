class CourseResource < BaseResource
  has_one :semester
  has_one :coursetype
  has_one :faculty
  has_many :lectures
  has_many :lecturers
  has_many :complaints
  attributes :name, :facultyname, :lecturernames, :lsf_id, :complaint_count
  def complaint_count
    @model.complaints.size
  end
  def lecturernames
    self.lecturers.collect!{|x| x.surname}.join(", ")
  end
  def facultyname
    ""+self.faculty.name
  end
  def self.updatable_fields(context)
    super - [:lecturernames,:facultyname]
  end
  def self.creatable_fields(context)
    super - [:lecturernames,:facultyname]
  end
  filters :coursesearch, :lecturers, :name, :semester
  filter :coursesearch, apply: ->(records, value, _options) {
    value_regex = Array.wrap(value).join('|')
    records.joins(:lectures => :lecturer).where("name ~* ? OR lecturers.surname ~* ?",value_regex,value_regex).distinct
}
end
