class AddWantsreviewToLecturers < ActiveRecord::Migration[5.2]
  def change
    add_column :lecturers, :wantsreview, :boolean, :default => true
  end
end
