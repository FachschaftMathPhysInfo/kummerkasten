class AddArchivedToSemester < ActiveRecord::Migration[5.2]
  def change
      add_column :semesters, :archived, :boolean, :default => false
  end
end

