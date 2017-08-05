class AddPassword < ActiveRecord::Migration[5.1]
  def change
    add_column :lecturers, :password,:string
  end
end
