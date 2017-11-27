class RemindComplaintJob < ApplicationJob
  queue_as :default

  def perform(*)
      RemindComplaintMailer.unchecked_email().deliver_now
  end
end
