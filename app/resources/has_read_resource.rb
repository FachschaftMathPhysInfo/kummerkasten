class HasReadResource < JSONAPI::Resource
  belongs_to :complaint
  belongs_to :lecturer
end
