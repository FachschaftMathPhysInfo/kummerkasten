class HasReadResource < JSONAPI::Resource
  has_one :complaint
  has_one :lecturer
end
