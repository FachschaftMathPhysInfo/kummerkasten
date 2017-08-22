class AddNotificationsToLecturer < ActiveRecord::Migration[5.1]
  def change
    add_column :lecturers, :notifications, :string, :default => "every"
  end
end
