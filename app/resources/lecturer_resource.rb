class LecturerResource < BaseResource
  attributes :email, :surname, :givenname, :salutation, :notifications, :lsf_id, :invite, :password
  has_many :hasreads
  has_many :courses
  has_many :complaints, class_name:"Complaint"
  has_many :readcomplaints, class_name:"Complaint"
  attribute :unreadcomplaints_count
  filters :surname
  filter :surname, apply: ->(records, value, _options) {
    value_regex = Array.wrap(value).join('|')
    records.where("surname ~* ?",value_regex).distinct
  }
  def unreadcomplaints_count
    @model.unreadcomplaints.size
  end
  def self.updatable_fields(context)
    super - [:unreadcomplaints_count,:password]
  end
  def self.creatable_fields(context)
    super - [:unreadcomplaints_count,:password]
  end

  before_save :send_welcome
  def send_welcome
    if @model.invite
      passwort=SecureRandom.base64(12)
      @model.update({password:passwort,password_confirmation:passwort,invite:false})
      LecturerInviteMailer.welcome(@model,passwort).deliver_now
    end
  end
end
