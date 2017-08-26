class LecturerResource < BaseResource
  attributes :email, :surname, :givenname, :salutation, :notifications, :lsf_id
  has_many :hasreads
  has_many :courses
  has_many :complaints, class_name:"Complaint"
  has_many :readcomplaints, class_name:"Complaint"
  attribute :unreadcomplaints_count
  def unreadcomplaints_count
    @model.unreadcomplaints.size
  end

    def self.updatable_fields(context)
      super - [:unreadcomplaints_count]
    end
    def self.creatable_fields(context)
      super - [:unreadcomplaints_count]
    end
end
