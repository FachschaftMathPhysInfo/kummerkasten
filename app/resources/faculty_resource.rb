class FacultyResource < BaseResource
  has_many :courses
  attributes :name, :lsf_id
  filter :name, apply: ->(records,value,_options) {
    records.where("name ~* ?",value)
  }
end
