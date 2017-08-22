class HasreadResource < BaseResource
  has_one :complaint
  has_one :lecturer
  after_save :unnotify_lecturer
  def unnotify_lecturer
    #Würde alle Un notifizierte Löschen
    #@model.lecturer.unnotifiedcomplaints.delete_all
    #
    @model.lecturer.unnotifiedcomplaints.where(complaint: @model.complaint).delete_all
  end
end
