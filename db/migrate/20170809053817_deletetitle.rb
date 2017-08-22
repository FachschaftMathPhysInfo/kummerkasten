class Deletetitle < ActiveRecord::Migration[5.1]
  def change
    remove_column :complaints, :title
  end
end
