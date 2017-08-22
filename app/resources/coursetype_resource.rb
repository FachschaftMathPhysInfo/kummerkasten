class CoursetypeResource < BaseResource
  has_many :courses
  attributes :name
end
