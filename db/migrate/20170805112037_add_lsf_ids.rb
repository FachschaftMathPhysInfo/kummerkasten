class AddLsfIds < ActiveRecord::Migration[5.1]
  def change
    add_column :courses, :lsf_id, :integer, :unique => true
    add_column :faculties, :lsf_id, :integer, :unique => true
    add_column :semesters, :lsf_id, :integer, :unique => true
    add_column :lecturers, :lsf_id, :integer, :unique => true
  end
end
