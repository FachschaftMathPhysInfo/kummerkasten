class CoursetypeResource < JSONAPI::Resource
  has_many :courses
  attributes :name
end
